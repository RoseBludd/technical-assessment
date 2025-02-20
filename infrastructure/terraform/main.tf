provider "aws" {
  region = var.aws_region
}

# VPC and Network Configuration
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr             = var.vpc_cidr
  environment          = var.environment
  availability_zones   = var.availability_zones
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
}

# Security Groups
module "security" {
  source = "./modules/security"
  
  vpc_id          = module.vpc.vpc_id
  environment     = var.environment
  allowed_cidr    = var.allowed_cidr
}

# RDS PostgreSQL
module "rds" {
  source = "./modules/rds"
  
  environment          = var.environment
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  security_group_id   = module.security.rds_security_group_id
  instance_class      = var.db_instance_class
  allocated_storage   = var.db_allocated_storage
  database_name       = var.database_name
  database_username   = var.database_username
  database_password   = var.database_password
  multi_az           = var.multi_az
  backup_retention_period = var.backup_retention_period
}

# Monitoring
module "monitoring" {
  source = "./modules/monitoring"
  
  environment     = var.environment
  rds_instance_id = module.rds.rds_instance_id
  cpu_threshold   = var.cpu_threshold
  storage_threshold = var.storage_threshold
  connections_threshold = var.connections_threshold
}
