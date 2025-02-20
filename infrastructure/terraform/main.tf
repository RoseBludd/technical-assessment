provider "aws" {
  region = var.aws_region
}

###############################################
# VPC Configuration with Private ACL for RDS
###############################################
module "vpc" {
  source = "./modules/network"

  name = "assessment-vpc"
  cidr = var.vpc_cidr_block

  azs             = var.availability_zones
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  enable_dns_support   = true
  enable_dns_hostnames = true

  # Enable dedicated Network ACL for private subnets
  private_dedicated_network_acl = true

  # Define inbound ACL rules for RDS security
  private_inbound_acl_rules = [
    {
      rule_number = 100
      rule_action = "allow"
      protocol    = "tcp"
      from_port   = 5432
      to_port     = 5432
      cidr_block  = var.vpc_cidr_block # CIDR of allowed clients (e.g., app servers)
    },
    {
      rule_number = 200
      rule_action = "allow"
      protocol    = "tcp"
      from_port   = 1024
      to_port     = 65535
      cidr_block  = var.vpc_cidr_block
    }
  ]

  # Define outbound ACL rules for RDS responses
  private_outbound_acl_rules = [
    {
      rule_number = 100
      rule_action = "allow"
      protocol    = "tcp"
      from_port   = 5432
      to_port     = 5432
      cidr_block  = var.vpc_cidr_block
    },
    {
      rule_number = 200
      rule_action = "allow"
      protocol    = "tcp"
      from_port   = 1024
      to_port     = 65535
      cidr_block  = var.vpc_cidr_block
    }
  ]

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}


###############################################
# Optimized RDS PostgreSQL Configuration
###############################################

module "rds" {
  source = "./modules/rds"

  identifier              = "assessment-db"
  engine                  = "postgres"
  engine_version          = "17.3"
  instance_class          = "db.t4g.micro" # Balanced for cost and performance
  allocated_storage       = 20
  max_allocated_storage   = 100
  multi_az                = true
  storage_type            = "gp3" # Optimized for cost and performance
  backup_retention_period = 7
  deletion_protection     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = "5432"

  vpc_security_group_ids = [module.db_sg.security_group_id]
  subnet_ids             = module.vpc.private_subnets

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  monitoring_interval                   = 60 # Enable enhanced monitoring
  monitoring_role_name                  = "rds-monitoring-role"
  create_monitoring_role                = true

  create_db_subnet_group = true
  family                 = "postgres17"
  major_engine_version   = "17"

  enabled_cloudwatch_logs_exports        = ["postgresql", "upgrade"]
  cloudwatch_log_group_retention_in_days = 14

  tags = {
    Owner       = "user"
    Environment = "dev"
    CostCenter  = "Database"
  }
}

###############################################
# Security Group for RDS
###############################################
module "db_sg" {
  source = "./modules/security-group"

  name        = "rds-security-group"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      rule        = "postgresql-tcp"
      cidr_blocks = module.vpc.vpc_cidr_block
    }
  ]

  egress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = {
    Name        = "rds-security-group"
    Environment = "dev"
  }
}

###############################################
# CloudWatch Alarms for RDS Monitoring
###############################################

# Alarm for high CPU utilization in RDS instance
# Triggers when CPU usage exceeds 80% for two consecutive periods
module "cloudwatch_alarms" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 3.0"

  alarm_name          = "rds-cpu-utilization"
  alarm_description   = "Alarm when RDS CPU utilization exceeds threshold"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  threshold           = 80
  period              = 300
  unit                = "Percent"

  namespace   = "AWS/RDS"
  metric_name = "CPUUtilization"
  statistic   = "Average"

  dimensions = {
    DBInstanceIdentifier = module.rds.db_instance_identifier
  }
}

###############################################
# Alarm for low storage space in RDS instance
# Triggers when free storage falls below 5GB
module "cloudwatch_storage_alarm" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 3.0"

  alarm_name          = "rds-low-storage"
  alarm_description   = "Alarm when RDS free storage space is low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  threshold           = 5000 # 5GB
  period              = 300
  unit                = "Megabytes"

  namespace   = "AWS/RDS"
  metric_name = "FreeStorageSpace"
  statistic   = "Average"

  dimensions = {
    DBInstanceIdentifier = module.rds.db_instance_identifier
  }
}

###############################################
# Alarm for high number of database connections
# Triggers when active connections exceed 100
module "cloudwatch_connection_alarm" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 3.0"

  alarm_name          = "rds-high-connections"
  alarm_description   = "Alarm when RDS connection count is high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  threshold           = 100
  period              = 300
  unit                = "Count"

  namespace   = "AWS/RDS"
  metric_name = "DatabaseConnections"
  statistic   = "Average"

  dimensions = {
    DBInstanceIdentifier = module.rds.db_instance_identifier
  }
}

###############################################
# AWS WAF for Protecting RDS-Connected APIs
###############################################

# Web ACL to filter malicious requests
resource "aws_wafv2_web_acl" "rds_waf" {
  name        = "rds-waf"
  scope       = "REGIONAL" # Use CLOUDFRONT if needed for global protection
  description = "WAF to protect against SQL Injection and other attacks"

  default_action {
    allow {}
  }

  rule {
    name     = "SQLInjectionProtection"
    priority = 1

    action {
      block {}
    }

    statement {
      sqli_match_statement {
        field_to_match {
          all_query_arguments {}
        }
        text_transformation {
          priority = 0
          type     = "URL_DECODE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLInjectionAttempts"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "BlockMaliciousIPs"
    priority = 2

    action {
      block {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.malicious_ips.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockedIPs"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimit"
    priority = 3

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 2000 # Max 2000 requests per 5 minutes per IP
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitExceeded"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "WAFLogs"
    sampled_requests_enabled   = true
  }
}

# IP set for blocking known malicious IPs
resource "aws_wafv2_ip_set" "malicious_ips" {
  name               = "blocked-ips"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"
  addresses          = ["192.168.1.100/32", "203.0.113.0/24"]
}

# Example Attach the WAF to ALB
# resource "aws_lb" "my_alb" {
#   name               = "my-alb"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.alb_sg.id]
#   subnets           = module.vpc.public_subnets
# }

# resource "aws_wafv2_web_acl_association" "waf_alb_assoc" {
#   resource_arn = aws_lb.my_alb.arn
#   web_acl_arn  = aws_wafv2_web_acl.rds_waf.arn
# }

# Example Attach the WAF to API Gateway
# resource "aws_wafv2_web_acl_association" "waf_api_assoc" {
#   resource_arn = aws_apigatewayv2_stage.api_stage.arn
#   web_acl_arn  = aws_wafv2_web_acl.rds_waf.arn
# }
