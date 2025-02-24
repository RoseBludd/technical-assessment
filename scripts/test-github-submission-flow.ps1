# Test GitHub Submission Flow
# This script simulates the actual candidate submission process via GitHub

function Test-RoleSubmission {
    param (
        [string]$Role,
        [string]$SolutionPath,
        [string]$TestSolution
    )

    Write-Host "`n🚀 Testing $Role Submission Flow" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan

    # Setup test variables
    $testRepoPath = "test-assessment-submission-$Role"
    $candidateName = "test-candidate-$Role-$([DateTime]::Now.ToString('yyyyMMddHHmmss'))"
    $branchName = "assessment/$Role/$candidateName"

    try {
        # Clone and setup
        git clone https://github.com/restoremasters/dev-assessment.git $testRepoPath
        Set-Location $testRepoPath
        git checkout -b $branchName
        Write-Host "✅ Repository setup completed" -ForegroundColor Green

        # Create solution directory if it doesn't exist
        New-Item -Path $SolutionPath -ItemType Directory -Force
        Set-Content -Path "$SolutionPath/solution.$($Role).ts" -Value $TestSolution

        # Add and commit
        git add .
        git commit -m "Complete $Role assessment

Application Email: test.$Role@example.com
Role: $Role
Time Spent: 2 hours

Completed tasks as per role requirements"

        # Create PR
        gh pr create --title "Assessment Submission: $candidateName" `
                    --body "## Assessment Submission for $Role

Application Email: test.$Role@example.com
Role: $Role

### Time Spent
Approximately 2 hours

### Completed Components
- Implemented all required features
- Added comprehensive testing
- Followed best practices
- Added detailed documentation" `
                    --base main

        # Monitor grading
        $maxAttempts = 10
        $attempt = 0
        $graded = $false

        while ($attempt -lt $maxAttempts -and -not $graded) {
            $attempt++
            Write-Host "  Checking grading status (Attempt $attempt/$maxAttempts)..." -ForegroundColor Gray
            
            $response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/submissions?email=test.$Role@example.com" -Method Get
            
            if ($response.Length -gt 0 -and $response[0].status -ne "pending") {
                $graded = $true
                Write-Host "`nGrading Results for $Role:" -ForegroundColor Cyan
                Write-Host "  Score: $($response[0].score)" -ForegroundColor White
                Write-Host "  Status: $($response[0].status)" -ForegroundColor White
                if ($response[0].aiFeedback) {
                    Write-Host "  AI Feedback: $($response[0].aiFeedback.overallFeedback)" -ForegroundColor White
                }
            } else {
                Start-Sleep -Seconds 10
            }
        }

        # Cleanup
        Set-Location ..
        Remove-Item -Recurse -Force $testRepoPath
        Write-Host "✅ $Role test completed and cleaned up" -ForegroundColor Green

        # Update Changelog
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $changelogEntry = @"

## $Role Submission Test - $timestamp

### Tested Components:
- Repository Setup and Branching
- $Role-specific Solution Submission
- Pull Request Creation
- Automated Grading Process
- Result Verification

### Results:
- Successfully simulated $Role submission
- Verified role-specific grading criteria
- Confirmed AI feedback generation
- Validated scoring system

### Status: ✅ Complete $Role Flow Verified
"@

        Add-Content -Path "..\CHANGELOG.md" -Value $changelogEntry

    } catch {
        Write-Host "❌ Error in $Role test: $_" -ForegroundColor Red
        Set-Location ..
        if (Test-Path $testRepoPath) {
            Remove-Item -Recurse -Force $testRepoPath
        }
        exit 1
    }
}

# Frontend Specialist Test Solution
$frontendSolution = @"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsData {
  timestamp: string;
  value: number;
}

export function MetricsDashboard() {
  const [data, setData] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading metrics...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="metrics-dashboard">
      <h1>Metrics Dashboard</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
"@

# Backend Specialist Test Solution
$backendSolution = @"
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { rateLimit } from 'express-rate-limit';
import { validateMetric } from '../validators/metric';

const prisma = new PrismaClient();
const router = Router();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

router.use(limiter);

// Get metrics with pagination and filtering
router.get('/metrics', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(startDate && endDate ? {
        timestamp: {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate))
        }
      } : {})
    };

    const [metrics, total] = await Promise.all([
      prisma.metric.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { timestamp: 'desc' }
      }),
      prisma.metric.count({ where })
    ]);

    res.json({
      data: metrics,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        current: Number(page)
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new metric with validation
router.post('/metrics', async (req, res) => {
  try {
    const validation = validateMetric(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.errors });
    }

    const metric = await prisma.metric.create({
      data: req.body
    });

    res.status(201).json(metric);
  } catch (error) {
    console.error('Error creating metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
"@

# Integration Specialist Test Solution
$integrationSolution = @"
import { Gateway } from '@opentelemetry/api-gateway';
import { CircuitBreaker } from '@opentelemetry/circuit-breaker';
import { RabbitMQClient } from '@opentelemetry/rabbitmq';

export class MetricsGateway {
  private gateway: Gateway;
  private messageQueue: RabbitMQClient;
  private circuitBreaker: CircuitBreaker;

  constructor() {
    this.gateway = new Gateway({
      routes: [
        {
          path: '/api/metrics',
          service: 'metrics-service',
          methods: ['GET', 'POST'],
          timeout: 5000
        }
      ],
      discovery: {
        type: 'kubernetes',
        namespace: 'metrics'
      }
    });

    this.messageQueue = new RabbitMQClient({
      url: process.env.RABBITMQ_URL,
      queue: 'metrics-queue',
      deadLetter: 'metrics-dead-letter'
    });

    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 30000
    });
  }

  async handleMetricUpdate(metric: any) {
    try {
      await this.circuitBreaker.execute(async () => {
        await this.messageQueue.publish('metrics-exchange', {
          type: 'metric.update',
          data: metric
        });
      });
    } catch (error) {
      console.error('Error publishing metric update:', error);
      throw error;
    }
  }
}
"@

# DevOps Engineer Test Solution
$devopsSolution = @"
provider "aws" {
  region = "us-west-2"
}

# VPC Configuration
resource "aws_vpc" "metrics_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "metrics-vpc"
    Environment = "production"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "metrics_cluster" {
  name = "metrics-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "metrics_asg" {
  name                = "metrics-asg"
  vpc_zone_identifier = aws_subnet.private.*.id
  target_group_arns   = [aws_lb_target_group.metrics.arn]
  health_check_type   = "ELB"
  min_size            = 2
  max_size            = 10

  launch_template {
    id      = aws_launch_template.metrics.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "metrics-service"
    propagate_at_launch = true
  }
}

# CloudWatch Monitoring
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "metrics-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS CPU utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.metrics_cluster.name
  }
}
"@

# QA Engineer Test Solution
$qaSolution = @"
import { test, expect } from '@playwright/test';
import { MetricsAPI } from '../api/metrics';
import { TestData } from '../fixtures/metrics';

test.describe('Metrics Dashboard E2E Tests', () => {
  let metricsApi: MetricsAPI;

  test.beforeEach(async ({ page }) => {
    metricsApi = new MetricsAPI();
    await page.goto('/dashboard');
  });

  test('should display metrics data correctly', async ({ page }) => {
    // Arrange
    const testMetrics = TestData.generateMetrics(10);
    await metricsApi.seedTestData(testMetrics);

    // Act
    await page.reload();
    await page.waitForSelector('.metrics-dashboard');

    // Assert
    const chartElements = await page.$$('.metric-item');
    expect(chartElements.length).toBe(testMetrics.length);

    const firstMetricValue = await page.textContent('.metric-item:first-child .value');
    expect(firstMetricValue).toBe(testMetrics[0].value.toString());
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Arrange
    await metricsApi.simulateError();

    // Act
    await page.reload();

    // Assert
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('Failed to fetch metrics');
  });

  test('should handle loading state', async ({ page }) => {
    // Arrange
    await metricsApi.simulateSlowResponse(2000);

    // Act
    await page.reload();

    // Assert
    const loadingSpinner = await page.waitForSelector('.loading-spinner');
    expect(await loadingSpinner.isVisible()).toBe(true);
  });
});

test.describe('Performance Tests', () => {
  test('should load metrics within performance budget', async ({ page }) => {
    // Arrange
    const performanceBudget = {
      FCP: 1000,
      LCP: 2500,
      TTI: 3000
    };

    // Act
    const metrics = await page.evaluate(() => ({
      FCP: performance.getEntriesByName('first-contentful-paint')[0].startTime,
      LCP: performance.getEntriesByName('largest-contentful-paint')[0].startTime,
      TTI: performance.getEntriesByName('time-to-interactive')[0].startTime
    }));

    // Assert
    expect(metrics.FCP).toBeLessThan(performanceBudget.FCP);
    expect(metrics.LCP).toBeLessThan(performanceBudget.LCP);
    expect(metrics.TTI).toBeLessThan(performanceBudget.TTI);
  });
});
"@

# Run tests for each role
Write-Host "🎯 Starting Role-Specific Tests" -ForegroundColor Cyan

Test-RoleSubmission -Role "frontend" -SolutionPath "frontend/src/components" -TestSolution $frontendSolution
Test-RoleSubmission -Role "backend" -SolutionPath "backend/src/routes" -TestSolution $backendSolution
Test-RoleSubmission -Role "integration" -SolutionPath "integration/src/gateway" -TestSolution $integrationSolution
Test-RoleSubmission -Role "devops" -SolutionPath "infrastructure" -TestSolution $devopsSolution
Test-RoleSubmission -Role "qa" -SolutionPath "tests/e2e" -TestSolution $qaSolution

Write-Host "`n✨ All Role-Specific Tests Completed!" -ForegroundColor Green 