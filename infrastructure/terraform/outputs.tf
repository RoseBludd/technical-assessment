###############################################
# VPC Outputs
###############################################
output "vpc_id" {
  description = "The ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnets" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnets
}

output "nat_gateway_ids" {
  description = "List of NAT Gateway IDs"
  value       = module.vpc.natgw_ids
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = module.vpc.igw_id
}

###############################################
# RDS Outputs
###############################################
output "rds_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "rds_instance_id" {
  description = "The ID of the RDS instance"
  value       = module.rds.db_instance_identifier
}

output "rds_security_group_id" {
  description = "The Security Group ID associated with the RDS instance"
  value       = module.db_sg.security_group_id
}

output "rds_enhanced_monitoring_role_name" {
  description = "The name of the enhanced monitoring IAM role"
  value       = module.rds.enhanced_monitoring_iam_role_name
}

output "rds_enhanced_monitoring_role_arn" {
  description = "The ARN of the enhanced monitoring IAM role"
  value       = module.rds.enhanced_monitoring_iam_role_arn
}

output "rds_instance_port" {
  description = "The port of the RDS instance"
  value       = module.rds.db_instance_port
}

output "rds_instance_status" {
  description = "The status of the RDS instance"
  value       = module.rds.db_instance_status
}

output "rds_instance_resource_id" {
  description = "The RDS resource ID"
  value       = module.rds.db_instance_resource_id
}

output "rds_db_parameter_group_id" {
  description = "The ID of the RDS parameter group"
  value       = module.rds.db_parameter_group_id
}

output "rds_db_subnet_group" {
  description = "The ID of the RDS subnet group"
  value       = module.rds.db_subnet_group_id
}

output "rds_db_option_group_id" {
  description = "The ID of the RDS option group"
  value       = module.rds.db_option_group_id
}

output "rds_cloudwatch_log_groups" {
  description = "CloudWatch log groups for the RDS instance"
  value       = module.rds.db_instance_cloudwatch_log_groups
}



output "cloudwatch_alarm_cpu_arn" {
  description = "The ARN of the CloudWatch alarm for RDS CPU utilization"
  value       = module.cloudwatch_alarms.cloudwatch_metric_alarm_arn
}

output "cloudwatch_alarm_storage_arn" {
  description = "The ARN of the CloudWatch alarm for RDS storage space"
  value       = module.cloudwatch_storage_alarm.cloudwatch_metric_alarm_arn
}

output "cloudwatch_alarm_connections_arn" {
  description = "The ARN of the CloudWatch alarm for RDS database connections"
  value       = module.cloudwatch_connection_alarm.cloudwatch_metric_alarm_arn
}


# output "rds_security_group_id" {
#   description = "The ID of the security group associated with the RDS instance"
#   value       = module.db_sg.security_group_id
# }

output "rds_security_group_arn" {
  description = "The ARN of the security group associated with the RDS instance"
  value       = module.db_sg.security_group_arn
}

output "rds_security_group_vpc_id" {
  description = "The VPC ID associated with the security group"
  value       = module.db_sg.security_group_vpc_id
}

output "rds_security_group_owner_id" {
  description = "The AWS Account ID that owns the security group"
  value       = module.db_sg.security_group_owner_id
}


###############################################
# WAF Outputs
###############################################

output "waf_web_acl_id" {
  description = "The ID of the AWS WAF Web ACL"
  value       = aws_wafv2_web_acl.rds_waf.id
}

output "waf_web_acl_arn" {
  description = "The ARN of the AWS WAF Web ACL"
  value       = aws_wafv2_web_acl.rds_waf.arn
}

output "waf_web_acl_capacity" {
  description = "The capacity units required for the WAF Web ACL"
  value       = aws_wafv2_web_acl.rds_waf.capacity
}

output "waf_ip_set_id" {
  description = "The ID of the AWS WAF IP set"
  value       = aws_wafv2_ip_set.malicious_ips.id
}

output "waf_ip_set_arn" {
  description = "The ARN of the AWS WAF IP set"
  value       = aws_wafv2_ip_set.malicious_ips.arn
}
