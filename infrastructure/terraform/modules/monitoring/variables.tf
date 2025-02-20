variable "environment" {
  description = "Environment name"
  type        = string
}

variable "rds_instance_id" {
  description = "RDS instance ID"
  type        = string
}

variable "cpu_threshold" {
  description = "CPU utilization threshold for alerting"
  type        = number
}

variable "storage_threshold" {
  description = "Storage threshold percentage for alerting"
  type        = number
}

variable "connections_threshold" {
  description = "Database connections threshold for alerting"
  type        = number
}
