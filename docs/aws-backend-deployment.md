# AWS Backend POC Deployment Runbook

This guide walks through deploying the LifeOS backend to the public internet using AWS Lambda Function URL and GitHub Actions.

The goal is a cautious, low-cost POC. This setup avoids always-on compute, API Gateway, NAT gateways, load balancers, RDS, and artifact buckets. It does not guarantee a zero bill, but it keeps AWS resources minimal.

## 0. What You Are About To Create

This deployment creates or updates these AWS resources:

- One Lambda function, default name `lifeos-backend-poc`
- One public Lambda Function URL, like `https://abc123.lambda-url.ap-south-1.on.aws/`
- One IAM role for the Lambda function, default name `lifeos-backend-poc-lambda-role`
- One CloudWatch log group, default name `/aws/lambda/lifeos-backend-poc`

This deployment does not create:

- RDS database
- EC2 server
- Load balancer
- NAT gateway
- API Gateway
- S3 bucket
- VPC resources

## 1. Cost Safety First

Do this before deploying anything.

### 1.1 Confirm Why We Are Not Using RDS

Your AWS account is older than one year, so do not assume old first-year free-tier services are free. RDS is intentionally not provisioned here. Use an existing Postgres database or a free hosted Postgres provider, then provide its connection string as `DATABASE_URL`.

### 1.2 Create A Billing Alarm

1. Open AWS Console.
2. Search for `Billing and Cost Management`.
3. Open `Budgets`.
4. Choose `Create budget`.
5. Select `Use a template` if available.
6. Pick a monthly cost budget.
7. Set the amount to something tiny, for example `$1` or `$5`.
8. Add your email address for alerts.
9. Create the budget.

Stop and verify: you should see a monthly budget listed in AWS Budgets.

### 1.3 Keep Concurrency Low

The workflow leaves `RESERVED_CONCURRENCY` blank by default because some AWS accounts cannot reserve concurrency without dropping below the required unreserved minimum. For a POC, keep it blank unless you know your Lambda quota has enough room. If you later want a cap, set `RESERVED_CONCURRENCY=2` as a GitHub variable and rerun the workflow.

## 2. Prepare The Database

The backend requires Postgres because it uses Drizzle and `pg`.

### 2.1 Choose A Postgres Database

Use one of these:

- An existing Postgres database you already control.
- A free hosted Postgres database provider.
- A local or temporary database exposed only if you know exactly what you are doing.

Avoid AWS RDS for this POC if your goal is no ongoing AWS database cost.

### 2.2 Collect The Connection String

You need a connection string in this format:

```text
postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Many hosted Postgres providers require SSL. If your provider gives you a connection string, use that exact string.

Stop and verify: keep the connection string ready, but do not commit it to git.

### 2.3 Run Database Migrations

From your machine:

```bash
cd backend
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" npm run db:migrate
```

If you are using PowerShell, use:

```powershell
cd backend
$env:DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
npm run db:migrate
```

Stop and verify: migrations should complete without errors. If they fail, fix the database connection before deploying Lambda.

## 3. Prepare AWS Credentials For GitHub Actions

The GitHub workflow needs AWS credentials so it can create/update Lambda resources.

### 3.1 Create An IAM User

1. Open AWS Console.
2. Search for `IAM`.
3. Go to `Users`.
4. Choose `Create user`.
5. Name it something clear, for example `lifeos-github-deployer`.
6. Do not enable console access.
7. Continue to permissions.

### 3.2 Attach Permissions

For a cautious POC, attach these AWS-managed policies:

- `AWSLambda_FullAccess`
- `CloudWatchLogsFullAccess`
- `IAMFullAccess`

This is broad, but simple for a POC. After the POC works, replace it with a narrower custom policy.

Stop and verify: the user should exist and have permissions for Lambda, IAM, CloudWatch Logs, and STS.

### 3.3 Create Access Keys

1. Open the IAM user you created.
2. Go to `Security credentials`.
3. Choose `Create access key`.
4. Pick `Application running outside AWS` or equivalent.
5. Create the key.
6. Copy both values:
   - Access key ID
   - Secret access key

Important: AWS shows the secret access key only once. Store it carefully until you add it to GitHub.

## 4. Configure GitHub Secrets And Variables

Open your GitHub repository in the browser.

### 4.1 Add Required Secrets

Go to:

`Settings -> Secrets and variables -> Actions -> Secrets -> New repository secret`

Add these secrets:

```text
AWS_ACCESS_KEY_ID=your AWS access key id
AWS_SECRET_ACCESS_KEY=your AWS secret access key
DATABASE_URL=your Postgres connection string
JWT_SECRET=a long random secret
```

Optional, but needed for AI routes:

```text
OPENAI_API_KEY=your OpenAI key
```

For `JWT_SECRET`, generate a strong random value. Example using Node:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Stop and verify: GitHub should list the secret names, but not their values.

### 4.2 Add Optional Variables

Go to:

`Settings -> Secrets and variables -> Actions -> Variables -> New repository variable`

Recommended variables:

```text
AWS_REGION=ap-south-1
BACKEND_FUNCTION_NAME=lifeos-backend-poc
CORS_ALLOW_ORIGIN=*
# RESERVED_CONCURRENCY=2  # optional; leave unset by default
```

For mobile app testing, `CORS_ALLOW_ORIGIN=*` is acceptable for a POC. For production, restrict it.

## 5. Commit And Push The Deployment Files

Make sure these files are included in your commit:

```text
.github/workflows/deploy-backend-aws.yml
backend/package.json
backend/package-lock.json
backend/src/lambda.ts
infra/aws/deploy-lambda-url.sh
docs/aws-backend-deployment.md
```

Check status:

```bash
git status --short
```

Commit only the deployment-related files. There are other existing local changes in this workspace, so be careful not to accidentally commit unrelated app work.

Example:

```bash
git add .github/workflows/deploy-backend-aws.yml backend/package.json backend/package-lock.json backend/src/lambda.ts infra/aws/deploy-lambda-url.sh docs/aws-backend-deployment.md
git commit -m "Add AWS Lambda backend deployment pipeline"
git push origin main
```

Stop and verify: GitHub should show the new workflow under the `Actions` tab.

## 6. Run The Deployment Workflow

1. Open GitHub repository.
2. Go to `Actions`.
3. Select `Deploy Backend to AWS`.
4. Choose `Run workflow`.
5. Select branch `main`.
6. Run it.

Watch the logs. The workflow uses Bun to install/build dependencies and deploys the Lambda function with the `nodejs24.x` runtime. It should do these steps:

- Checkout
- Setup Bun
- Install backend dependencies with `bun install --frozen-lockfile`
- Build Lambda bundle with `bun run build:lambda`
- Create deployment zip
- Configure AWS credentials
- Deploy Lambda Function URL

Stop and verify: the final logs should print something like:

```text
Function URL: https://abc123.lambda-url.ap-south-1.on.aws/
Health check: https://abc123.lambda-url.ap-south-1.on.aws/health
```

Save the Function URL.

## 7. Test The Public Backend

Open the health URL in your browser:

```text
https://abc123.lambda-url.ap-south-1.on.aws/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

You can also test with curl:

```bash
curl https://abc123.lambda-url.ap-south-1.on.aws/health
```

Stop and verify: do not update the mobile app until `/health` works.

## 8. Connect The Mobile App To The Backend

Find where the app reads its API base URL. In this repo, start with:

```text
LifeOS/utils/api.ts
LifeOS/utils/env.ts
LifeOS/.env
```

Set the backend base URL to the Lambda Function URL, for example:

```text
https://abc123.lambda-url.ap-south-1.on.aws
```

Avoid adding a trailing `/api/v1` unless the app expects it. The backend already exposes routes like:

```text
/api/v1/auth
/api/v1/users
/api/v1/decisions
/api/v1/analytics
/api/v1/ai
```

Stop and verify: login/register or a simple API-backed screen should reach the deployed backend.

## 9. Troubleshooting

### Workflow Fails At AWS Credentials

Check these GitHub secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

Also confirm the IAM user has enough permissions.

### Workflow Fails At Database Connection

Check:

- `DATABASE_URL` is present in GitHub secrets.
- The database allows external connections.
- SSL settings match your provider.
- Migrations have run successfully.

### Health Check Returns 500

Open AWS CloudWatch Logs:

1. AWS Console -> CloudWatch.
2. Go to `Log groups`.
3. Open `/aws/lambda/lifeos-backend-poc`.
4. Open the latest log stream.
5. Read the error.

Common causes:

- Missing `DATABASE_URL`
- Missing `JWT_SECRET`
- Database not reachable
- Database schema not migrated
- Missing `OPENAI_API_KEY` for AI routes

### Function URL Is Public

This POC uses `auth-type NONE`, so the Function URL is public. Your app routes still need application-level auth where implemented, but `/health` and any unauthenticated routes are internet-accessible.

If `/health` returns `Forbidden`, rerun the deployment workflow after confirming the deploy IAM user can run `lambda:AddPermission` and `lambda:RemovePermission`. The deploy script refreshes the `FunctionUrlPublicAccess` resource-policy statement on each run.

For production, add stronger controls before inviting users.

## 10. Update The Backend Later

After future backend changes:

1. Commit backend changes.
2. Push to `main`.
3. The workflow runs automatically if files under `backend/`, `infra/aws/`, or the workflow changed.
4. Test `/health` again.

You can also run the workflow manually from GitHub Actions.

## 11. Remove Everything If You Want To Stop

To stop public access and avoid future Lambda/log usage, run:

```bash
aws lambda delete-function --function-name lifeos-backend-poc --region ap-south-1
aws iam detach-role-policy --role-name lifeos-backend-poc-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name lifeos-backend-poc-lambda-role
aws logs delete-log-group --log-group-name /aws/lambda/lifeos-backend-poc --region ap-south-1
```

Stop and verify in AWS Console:

- Lambda function no longer exists.
- IAM role no longer exists.
- CloudWatch log group no longer exists.

## 12. Final Checklist

Before calling the POC deployed, confirm:

- AWS budget alert exists.
- Postgres database is ready and migrated.
- GitHub secrets are set.
- GitHub variables are set or defaults are acceptable.
- GitHub Actions workflow succeeds.
- `/health` returns `status: ok`.
- Mobile app points to the Function URL.
- You know how to delete the Lambda resources if needed.

