# Variables Documentation

## Core Variables

| Variable | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| aws_region | AWS region to deploy resources | string | us-west-2 | yes |
| environment | Environment name (dev/staging/prod) | string | dev | yes |
| vpc_cidr | CIDR block for VPC | string | 10.0.0.0/16 | yes |

## Database Variables

| Variable | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| database_name | Name of the PostgreSQL database | string | - | yes |
| database_username | Master username for PostgreSQL | string | - | yes |
| database_password | Master password for PostgreSQL | string | - | yes |
| db_instance_class | RDS instance type | string | db.t3.medium | yes |
| multi_az | Enable Multi-AZ deployment | bool | true | yes |

## Network Variables

| Variable | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| availability_zones | List of AZs | list(string) | ["us-west-2a", "us-west-2b"] | yes |
| private_subnet_cidrs | CIDR blocks for private subnets | list(string) | ["10.0.1.0/24", "10.0.2.0/24"] | yes |
| public_subnet_cidrs | CIDR blocks for public subnets | list(string) | ["10.0.101.0/24", "10.0.102.0/24"] | yes |

## Monitoring Variables

| Variable | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| cpu_threshold | CPU utilization alert threshold | number | 80 | yes |
| storage_threshold | Storage alert threshold | number | 85 | yes |
| connections_threshold | DB connections alert threshold | number | 100 | yes |
