#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?AWS_REGION is required}"
: "${FUNCTION_NAME:=lifeos-backend-poc}"
: "${ZIP_FILE:=backend/dist/lambda.zip}"
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"
: "${CORS_ALLOW_ORIGIN:=*}"
: "${RESERVED_CONCURRENCY:=}"

ROLE_NAME="${FUNCTION_NAME}-lambda-role"
POLICY_ARN="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
HANDLER="lambda.handler"
RUNTIME="nodejs24.x"
ARCHITECTURE="arm64"

if [ ! -f "$ZIP_FILE" ]; then
  echo "Deployment package not found: $ZIP_FILE" >&2
  exit 1
fi

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

TRUST_POLICY="$(mktemp)"
cat > "$TRUST_POLICY" <<'JSON'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
JSON

if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "file://${TRUST_POLICY}" >/dev/null
  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "$POLICY_ARN"
  sleep 10
fi

ENV_FILE="$(mktemp)"
node -e '
const fs = require("fs");
const vars = {
  NODE_ENV: "production",
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
if (process.env.OPENAI_API_KEY) {
  vars.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
}
fs.writeFileSync(process.argv[1], JSON.stringify({ Variables: vars }));
' "$ENV_FILE"

if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://${ZIP_FILE}" \
    --region "$AWS_REGION" >/dev/null
  aws lambda wait function-updated \
    --function-name "$FUNCTION_NAME" \
    --region "$AWS_REGION"
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --handler "$HANDLER" \
    --architectures "$ARCHITECTURE" \
    --memory-size 256 \
    --timeout 20 \
    --environment "file://${ENV_FILE}" \
    --region "$AWS_REGION" >/dev/null
else
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --role "$ROLE_ARN" \
    --handler "$HANDLER" \
    --architectures "$ARCHITECTURE" \
    --memory-size 256 \
    --timeout 20 \
    --zip-file "fileb://${ZIP_FILE}" \
    --environment "file://${ENV_FILE}" \
    --region "$AWS_REGION" >/dev/null
fi

aws lambda wait function-active \
  --function-name "$FUNCTION_NAME" \
  --region "$AWS_REGION"

if [ -n "$RESERVED_CONCURRENCY" ]; then
  aws lambda put-function-concurrency \
    --function-name "$FUNCTION_NAME" \
    --reserved-concurrent-executions "$RESERVED_CONCURRENCY" \
    --region "$AWS_REGION" >/dev/null
else
  aws lambda delete-function-concurrency \
    --function-name "$FUNCTION_NAME" \
    --region "$AWS_REGION" >/dev/null 2>&1 || true
fi
if aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
  aws lambda update-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --cors "AllowOrigins=${CORS_ALLOW_ORIGIN},AllowMethods=*,AllowHeaders=*,MaxAge=300" \
    --region "$AWS_REGION" >/dev/null
else
  aws lambda create-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --cors "AllowOrigins=${CORS_ALLOW_ORIGIN},AllowMethods=*,AllowHeaders=*,MaxAge=300" \
    --region "$AWS_REGION" >/dev/null
fi

aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FunctionUrlPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$AWS_REGION" >/dev/null 2>&1 || true

LOG_GROUP="/aws/lambda/${FUNCTION_NAME}"
aws logs create-log-group --log-group-name "$LOG_GROUP" --region "$AWS_REGION" >/dev/null 2>&1 || true
aws logs put-retention-policy \
  --log-group-name "$LOG_GROUP" \
  --retention-in-days 7 \
  --region "$AWS_REGION" >/dev/null

FUNCTION_URL="$(aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$AWS_REGION" --query FunctionUrl --output text)"
echo "Function URL: ${FUNCTION_URL}"
echo "Health check: ${FUNCTION_URL}health"

