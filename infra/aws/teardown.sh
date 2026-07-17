#!/usr/bin/env bash
# ---------------------------------------------------------------
# LifeOS – AWS Resource Teardown
# Removes everything created by deploy-lambda-url.sh:
#   • Lambda Function (+ Function URL)
#   • IAM Role & policy attachment
#   • CloudWatch Log Group
# ---------------------------------------------------------------
set -euo pipefail

FUNCTION_NAME="${FUNCTION_NAME:-lifeos-backend-poc}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
ROLE_NAME="${FUNCTION_NAME}-lambda-role"
POLICY_ARN="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
LOG_GROUP="/aws/lambda/${FUNCTION_NAME}"

echo ""
echo "================================================"
echo "  LifeOS AWS Teardown"
echo "  Function : $FUNCTION_NAME"
echo "  Region   : $AWS_REGION"
echo "  IAM Role : $ROLE_NAME"
echo "================================================"
echo ""

# Confirm before destroying
read -r -p "⚠️  This will PERMANENTLY delete all listed resources. Continue? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

# ── 1. Delete Lambda Function (also removes Function URL) ────────
echo ""
echo "▶ Deleting Lambda function: $FUNCTION_NAME ..."
if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$AWS_REGION" > /dev/null 2>&1; then
  aws lambda delete-function \
    --function-name "$FUNCTION_NAME" \
    --region "$AWS_REGION"
  echo "  ✓ Lambda function deleted."
else
  echo "  ℹ  Lambda function not found – skipping."
fi

# ── 2. Detach managed policy from IAM Role ───────────────────────
echo ""
echo "▶ Detaching policy from IAM role: $ROLE_NAME ..."
if aws iam get-role --role-name "$ROLE_NAME" > /dev/null 2>&1; then
  aws iam detach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "$POLICY_ARN" 2>/dev/null || echo "  ℹ  Policy was not attached – skipping."
  echo "  ✓ Policy detached."
else
  echo "  ℹ  IAM role not found – skipping detach."
fi

# ── 3. Delete IAM Role ───────────────────────────────────────────
echo ""
echo "▶ Deleting IAM role: $ROLE_NAME ..."
if aws iam get-role --role-name "$ROLE_NAME" > /dev/null 2>&1; then
  aws iam delete-role --role-name "$ROLE_NAME"
  echo "  ✓ IAM role deleted."
else
  echo "  ℹ  IAM role not found – skipping."
fi

# ── 4. Delete CloudWatch Log Group ──────────────────────────────
echo ""
echo "▶ Deleting CloudWatch log group: $LOG_GROUP ..."
if aws logs describe-log-groups \
     --log-group-name-prefix "$LOG_GROUP" \
     --region "$AWS_REGION" \
     --query "logGroups[?logGroupName=='$LOG_GROUP']" \
     --output text | grep -q "$LOG_GROUP"; then
  aws logs delete-log-group \
    --log-group-name "$LOG_GROUP" \
    --region "$AWS_REGION"
  echo "  ✓ Log group deleted."
else
  echo "  ℹ  Log group not found – skipping."
fi

echo ""
echo "================================================"
echo "  ✅  Teardown complete. All resources removed."
echo "================================================"
echo ""
