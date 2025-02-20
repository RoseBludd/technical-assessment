# Infrastructure as Code Task

## Objective

Create an AWS infrastructure using Terraform to deploy a PostgreSQL database with proper security, monitoring, and scalability.

## Requirements

### 1. Basic Infrastructure

- VPC with public and private subnets
- Internet Gateway and NAT Gateway
- Security Groups and Network ACLs

### 2. PostgreSQL Setup

- RDS PostgreSQL instance in private subnet
- Multi-AZ deployment for high availability
- Automated backups
- Performance insights enabled

### 3. Monitoring & Security

- CloudWatch alarms for:
  - CPU utilization
  - Storage space
  - Connection count
- Basic AWS WAF rules
- SSL/TLS encryption

### 4. Cost Optimization

- Use appropriate instance sizes
- Implement auto-scaling where needed
- Consider reserved instances
- Document cost estimates

## Getting Started

1. Use the provided Terraform template:

```bash
cd infrastructure/terraform
terraform init
```

2. Review and modify variables:

```bash
# Edit terraform.tfvars with your values
vim terraform.tfvars
```

3. Plan and apply:

```bash
terraform plan
terraform apply
```

## Tips

- Start with a dev environment configuration
- Focus on security best practices
- Document your design decisions
- Consider backup and disaster recovery
- Think about future scaling needs

## Evaluation Criteria

### Infrastructure Design (40%)

- Proper network segmentation
- Security group configurations
- High availability setup
- Backup strategy

### Cost Optimization (30%)

- Resource sizing
- Auto-scaling configuration
- Cost estimation
- Performance vs. cost balance

### Documentation (30%)

- Architecture diagram
- Setup instructions
- Variables documentation
- Maintenance procedures

## Submission Checklist

- [ ] Complete Terraform configurations
- [ ] Architecture diagram
- [ ] Cost estimation document
- [ ] Security considerations document
- [ ] Setup and maintenance instructions
