# Check GitHub Pull Requests
# This script verifies access to the assessment repository's pull requests

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$State = "all"  # Can be "open", "closed", or "all"
)

$ErrorActionPreference = "Stop"

# Repository details
$owner = "RoseBludd"
$repo = "technical-assessment"

Write-Host "Checking $State pull requests for $owner/$repo..." -ForegroundColor Cyan

try {
    # Build the URL with state parameter
    $url = "https://api.github.com/repos/$owner/$repo/pulls?state=$State"
    Write-Host "Fetching from: $url" -ForegroundColor Yellow
    
    # Set up headers
    $headers = @{
        "Accept" = "application/vnd.github.v3+json"
    }
    
    # Add authorization if token is provided
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
        Write-Host "Using provided authentication token" -ForegroundColor Green
    } else {
        Write-Host "No authentication token provided - using public access" -ForegroundColor Yellow
    }

    # Make the request
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    
    if ($response.Count -eq 0) {
        Write-Host "`nNo pull requests found with state: $State" -ForegroundColor Yellow
        
        # Check repository existence
        $repoUrl = "https://api.github.com/repos/$owner/$repo"
        try {
            $repoInfo = Invoke-RestMethod -Uri $repoUrl -Headers $headers -Method Get
            Write-Host "`nRepository Info:" -ForegroundColor Cyan
            Write-Host "Name: $($repoInfo.name)" -ForegroundColor White
            Write-Host "Visibility: $($repoInfo.visibility)" -ForegroundColor White
            Write-Host "Created: $($repoInfo.created_at)" -ForegroundColor White
            Write-Host "Last Updated: $($repoInfo.updated_at)" -ForegroundColor White
        } catch {
            Write-Host "`nCould not verify repository existence. It might be private or not exist." -ForegroundColor Red
        }
    } else {
        Write-Host "`nFound $($response.Count) pull requests:" -ForegroundColor Green
        
        foreach ($pr in $response) {
            Write-Host "`nPR #$($pr.number)" -ForegroundColor White
            Write-Host "Title: $($pr.title)" -ForegroundColor White
            Write-Host "State: $($pr.state)" -ForegroundColor White
            Write-Host "Created: $($pr.created_at)" -ForegroundColor White
            Write-Host "URL: $($pr.html_url)" -ForegroundColor White
            Write-Host "Branch: $($pr.head.ref)" -ForegroundColor White
            
            # Check if PR body contains application email
            if ($pr.body -match "Application Email:") {
                Write-Host "Contains application email: Yes" -ForegroundColor Green
                
                # Extract and show the email (masked)
                $emailMatch = $pr.body -match "Application Email:\s*\[?([^\]\s]+@[^\]\s]+)"
                if ($emailMatch) {
                    $email = $matches[1]
                    $maskedEmail = $email -replace "(?<=.{3}).(?=.*@)", "*"
                    Write-Host "Email found: $maskedEmail" -ForegroundColor Green
                }
            } else {
                Write-Host "Contains application email: No" -ForegroundColor Yellow
            }
            
            Write-Host "----------------------------------------"
        }
    }
} catch {
    Write-Host "`nError accessing pull requests:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse body:" -ForegroundColor Red
        Write-Host $responseBody
    }
} 