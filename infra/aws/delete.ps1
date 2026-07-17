# ── Step 1: Set your credentials (paste your actual keys) ──────
$env:AWS_ACCESS_KEY_ID = ""
$env:AWS_SECRET_ACCESS_KEY = ""
$env:AWS_DEFAULT_REGION = "ap-south-1"

$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$fn = "lifeos-backend-poc"
$role = "lifeos-backend-poc-lambda-role"
$policyArn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
$logGroup = "/aws/lambda/$fn"

# ── Step 2: Delete Lambda function (also removes Function URL) ──
& $aws lambda delete-function --function-name $fn
Write-Host "✓ Lambda deleted"

# ── Step 3: Detach policy then delete IAM role ─────────────────
& $aws iam detach-role-policy --role-name $role --policy-arn $policyArn
& $aws iam delete-role --role-name $role
Write-Host "✓ IAM role deleted"

# ── Step 4: Delete CloudWatch log group ────────────────────────
& $aws logs delete-log-group --log-group-name $logGroup
Write-Host "✓ Log group deleted"

Write-Host "`n✅ All LifeOS AWS resources cleaned up!"