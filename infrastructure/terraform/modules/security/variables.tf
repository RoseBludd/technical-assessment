variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "allowed_cidr" {
  description = "CIDR block allowed to connect to RDS"
  type        = string
}
