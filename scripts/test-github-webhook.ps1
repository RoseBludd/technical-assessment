# Test GitHub webhook with proper authentication
param(
    [Parameter(Mandatory=$false)]
    [string]$Email = "test@example.com",
    [Parameter(Mandatory=$false)]
    [string]$Role = "frontend",
    [string]$Token = $env:GITHUB_TOKEN
)

$ErrorActionPreference = "Stop"

Write-Host "Testing GitHub webhook..." -ForegroundColor Cyan

# Create test payload that matches real PR format
$payload = @{
    action = "opened"
    pull_request = @{
        number = 6  # Using real PR number
        html_url = "https://github.com/RoseBludd/technical-assessment/pull/6"  # Real repo URL
        title = "Complete Frontend Assessment"  # Real PR title format
        body = "Application Email: $Email"
        head = @{
            ref = "assessment/$Role/$(($Email -split '@')[0])"  # Using email username for branch
            repo = @{
                clone_url = "https://github.com/RoseBludd/technical-assessment.git"
                name = "technical-assessment"  # Real repo name
            }
        }
        user = @{
            login = ($Email -split '@')[0]  # Using email username as GitHub username
        }
    }
    repository = @{
        name = "technical-assessment"
        full_name = "RoseBludd/technical-assessment"
    }
}

try {
    # Send webhook request
    $webhookUrl = "http://localhost:3000/api/webhook/github"
    Write-Host "Sending webhook request to: $webhookUrl" -ForegroundColor Yellow
    Write-Host "Payload:" -ForegroundColor Yellow
    $payload | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body ($payload | ConvertTo-Json -Depth 10) -ContentType "application/json"
    
    Write-Host "`nWebhook Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5

    # Monitor submission status
    if ($response.submissionId) {
        Write-Host "`nMonitoring submission status..." -ForegroundColor Cyan
        $processed = $false
        $attempts = 0
        $maxAttempts = 10

        while (-not $processed -and $attempts -lt $maxAttempts) {
            Start-Sleep -Seconds 3
            $attempts++

            Write-Host "`nChecking application status (Attempt $attempts)..." -ForegroundColor Yellow
            $statusUrl = "http://localhost:3000/api/admin/applications"
            $response = Invoke-RestMethod -Uri $statusUrl -Method Get

            $application = $response.data | Where-Object { $_.email -eq $Email }
            
            if ($application -and $application.github_submission) {
                $processed = $true
                Write-Host "`nGitHub Submission Details:" -ForegroundColor Cyan
                Write-Host "  Status: $($application.github_submission.status)" -ForegroundColor White
                Write-Host "  PR Number: $($application.github_submission.prNumber)" -ForegroundColor White
                Write-Host "  Tasks Done: $($application.github_submission.tasksDone)/$($application.github_submission.totalTasks)" -ForegroundColor White
                Write-Host "  Submitted At: $($application.github_submission.submittedAt)" -ForegroundColor White
                Write-Host "  URL: $($application.github_submission.submissionUrl)" -ForegroundColor White
            } else {
                Write-Host "Submission processing..." -ForegroundColor Yellow
            }
        }

        if (-not $processed) {
            Write-Host "`nTimeout waiting for submission to be processed" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "`nError testing webhook:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        Write-Host "`nResponse status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Response status description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        
        $rawResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($rawResponse)
        $rawResponse.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse body:" -ForegroundColor Red
        Write-Host $responseBody
    }
} 