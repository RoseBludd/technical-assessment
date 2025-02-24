# Test webhook with real PR data
param(
    [Parameter(Mandatory=$true)]
    [string]$ApplicationId,
    
    [Parameter(Mandatory=$true)]
    [int]$PrNumber
)

Write-Host "Processing PR #$PrNumber for Application ID: $ApplicationId..."

$body = @{
    applicationId = $ApplicationId
    prNumber = $PrNumber
} | ConvertTo-Json -Depth 10

Write-Host "Sending webhook request..."
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/grade-submission" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "Response:"
$response | ConvertTo-Json -Depth 10
