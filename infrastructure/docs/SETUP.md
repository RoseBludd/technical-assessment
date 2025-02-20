# Setup Instructions

## Prerequisites
1. Terraform (v1.10.4 or compatible)
2. AWS CLI configured with appropriate credentials
3. Access to AWS account with necessary permissions

## Initial Setup

1. Clone the repository and navigate to the terraform directory:
```bash
cd infrastructure/terraform
```

2. Configure AWS credentials:
```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="us-west-2"  # or your preferred region
```

3. Initialize Terraform:
```bash
terraform init
```

4. Create a `terraform.tfvars` file with your specific values:
```hcl
aws_region = "us-west-2"
environment = "dev"
vpc_cidr = "10.0.0.0/16"
database_name = "your_db_name"
database_username = "your_username"
# Other variables as needed
```

5. Review the plan:
```bash
terraform plan
```

6. Apply the configuration:
```bash
terraform apply
```

## Post-Setup Configuration

1. Store the RDS endpoint for application use:
```bash
terraform output rds_endpoint
```

2. Configure security group rules if needed:
```bash
terraform apply -var='allowed_cidr=["10.0.0.0/16"]'
```

3. Verify CloudWatch alarms are active:
- Check AWS Console > CloudWatch > Alarms
- Confirm SNS topic subscriptions
