# Test script for PR grading functionality
param(
    [Parameter(Mandatory=$true)]
    [string]$ApplicationId,
    
    [Parameter(Mandatory=$true)]
    [int]$PrNumber,
    
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "http://localhost:3000"
)

# Function to make HTTP requests with error handling
function Invoke-ApiRequest {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = "$BaseUrl$Endpoint"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Error "API request failed: $_"
        Write-Error "Response: $($_.ErrorDetails.Message)"
        exit 1
    }
}

Write-Host "Testing PR grading functionality..."
Write-Host "Application ID: $ApplicationId"
Write-Host "PR Number: $PrNumber"
Write-Host "Base URL: $BaseUrl"
Write-Host ""

# Step 1: Trigger grading
Write-Host "Step 1: Triggering grading..."
$gradingResponse = Invoke-ApiRequest -Endpoint "/api/admin/grade-submission" -Method "POST" -Body @{
    applicationId = $ApplicationId
    prNumber = $PrNumber
}

Write-Host "Grading triggered successfully"
Write-Host "Score: $($gradingResponse.data.score)"
Write-Host ""

# Step 2: Verify application update
Write-Host "Step 2: Verifying application status..."
Start-Sleep -Seconds 2 # Give the database time to update

$testResults = Invoke-ApiRequest -Endpoint "/api/admin/test-results"
$application = $testResults.applications | Where-Object { $_.id -eq $ApplicationId }

if (-not $application) {
    Write-Error "Application not found in test results"
    exit 1
}

Write-Host "Application status: $($application.status)"
Write-Host "GitHub submission status: $($application.github_submission.status)"
Write-Host ""

# Step 3: Display AI feedback
Write-Host "Step 3: AI Feedback Summary"
Write-Host "----------------------------------------"
Write-Host "Overall Feedback:"
Write-Host $gradingResponse.data.feedback.overallFeedback
Write-Host ""

Write-Host "Technical Assessment:"
$gradingResponse.data.feedback.technicalAssessment.PSObject.Properties | ForEach-Object {
    Write-Host "$($_.Name):"
    Write-Host "  Score: $($_.Value.score)"
    Write-Host "  Feedback: $($_.Value.feedback)"
    Write-Host ""
}

Write-Host "Strengths:"
$gradingResponse.data.feedback.strengths | ForEach-Object {
    Write-Host "- $_"
}
Write-Host ""

Write-Host "Areas for Improvement:"
$gradingResponse.data.feedback.improvements | ForEach-Object {
    Write-Host "- $_"
}

Write-Host ""
Write-Host "Test completed successfully!" 