# Technical Assessment Instructions

## Overview

This assessment evaluates your practical skills in modern development practices, including:

- Working with AI tools effectively
- Infrastructure as Code (IaC)
- Git workflow
- Problem-solving in real-world scenarios
- Code quality and documentation

## Getting Started

1. Clone the assessment repository:

```bash
git clone https://github.com/restoremasters/dev-assessment
cd dev-assessment
```

2. Create a new branch with your name:

```bash
git checkout -b assessment/<your-name>
```

## Tasks

### 1. AI Integration Task (30 points)

Create a Node.js script that:

- Uses the Anthropic Claude API to analyze customer feedback
- Categorizes feedback into themes (bug reports, feature requests, etc.)
- Generates appropriate response templates
- Implements proper error handling and rate limiting
- Documents your prompt engineering approach

### 2. Infrastructure as Code Task (30 points)

Using Terraform or AWS CDK:

- Create an infrastructure setup for a scalable web application
- Include: VPC, ECS cluster, RDS instance, and Application Load Balancer
- Implement proper security groups and IAM roles
- Add monitoring and logging
- Document your infrastructure decisions

### 3. Full-Stack Feature Implementation (40 points)

Implement a feature that demonstrates your full-stack capabilities:

- Create a React component that displays infrastructure health metrics
- Implement a backend API that aggregates metrics from different sources
- Use WebSockets for real-time updates
- Include proper error handling and loading states
- Add comprehensive tests

## Evaluation Criteria

### Code Quality (25%)

- Clean, maintainable code
- Proper error handling
- Type safety (TypeScript)
- Testing coverage

### AI Integration (25%)

- Effective use of AI tools
- Quality of prompt engineering
- Error handling and edge cases
- Documentation of AI integration

### Infrastructure (25%)

- Infrastructure best practices
- Security considerations
- Scalability approach
- Documentation quality

### Problem Solving (25%)

- Solution architecture
- Performance considerations
- Edge case handling
- Documentation clarity

## Submission Instructions

1. Commit your changes:

```bash
git add .
git commit -m "Assessment submission: <your-name>"
```

2. Create a pull request:

- Base branch: main
- Title: "Assessment Submission: <Your Name>"
- Description: Include a summary of your approach and any assumptions made

3. Send an email to assessment@restoremasters.com with:

- Your PR link
- A brief explanation of your solution
- Any challenges faced and how you overcame them
- Time spent on each task

## Notes

- You have 48 hours to complete the assessment
- Use AI tools (like GitHub Copilot, ChatGPT, Claude) as you would in real work
- Document your AI usage in comments or commit messages
- Focus on quality over quantity
- Ask questions if anything is unclear

## Evaluation Process

1. Our AI system will perform an initial code review
2. A senior developer will review your solution
3. We'll schedule a follow-up discussion about your approach

Good luck! Remember to demonstrate not just what you build, but how you think and solve problems.
