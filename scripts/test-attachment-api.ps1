# Test script for task attachments API
Write-Host "Testing task attachments API..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api"
$taskId = "c076133d-9b95-484e-874c-0905e6f7a1c3" # Use the task ID from our previous test

# Test GET attachments
Write-Host "`nTesting GET /api/tasks/$taskId/attachments" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId/attachments" -Method Get
Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json

# Test POST attachment
Write-Host "`nTesting POST /api/tasks/$taskId/attachments" -ForegroundColor Yellow
$body = @{
    fileName = "test-screenshot.png"
    fileType = "image/png"
    fileSize = 1024
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId/attachments" -Method Post -Body $body -ContentType "application/json"
Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json

# Store attachment ID for deletion test
$attachmentId = $response.attachment.id

# Test DELETE attachment
Write-Host "`nTesting DELETE /api/tasks/$taskId/attachments" -ForegroundColor Yellow
$deleteBody = @{
    attachmentId = $attachmentId
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId/attachments" -Method Delete -Body $deleteBody -ContentType "application/json"
Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json 