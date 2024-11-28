# Variables for customization
variable "region" {
  default = "us-east-1"
}

variable "db_name" {
  default = "chat_app_db"
}

variable "db_username" {
  default = "master"
}

variable "db_password" {
  default = "securepassword" # Replace with a strong password or use a secret manager
}

variable "db_instance_class" {
  default = "db.t3.micro" # Change based on your requirements
}

variable "db_allocated_storage" {
  default = 20 # Minimum is 20GB
}

# Provider configuration
provider "aws" {
  region = var.region
}

resource "aws_db_parameter_group" "no_ssl_pg" {
  name        = "no-ssl-pg"
  family      = "postgres14"  # Make sure to match the PostgreSQL version you're using
  description = "Disable SSL for PostgreSQL RDS"

  parameter {
    name  = "rds.force_ssl"
    value = "0"  # Disabling SSL
    apply_method = "pending-reboot"  # This will apply changes after the instance is rebooted
  }
}
# RDS Security Group
resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Allow PostgreSQL access"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with your application's IP range
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds-security-group"
  }
}

# S3 Bucket to Store the Initialization Script
resource "aws_s3_bucket" "init_bucket" {
  bucket = "rds-init-scripts-${var.region}"

  tags = {
    Name = "rds-init-scripts"
  }
}

# Public Access Block Configuration for the S3 Bucket
resource "aws_s3_bucket_public_access_block" "init_bucket_access_block" {
  bucket = aws_s3_bucket.init_bucket.bucket

  block_public_acls     = true
  block_public_policy   = true
  ignore_public_acls    = true
  restrict_public_buckets = true
}

# RDS Instance
resource "aws_db_instance" "postgres" {
  allocated_storage    = var.db_allocated_storage
  instance_class       = var.db_instance_class
  engine               = "postgres"
  engine_version       = "14"
  username             = var.db_username
  password             = var.db_password
  db_name              = var.db_name  # Set db_name here instead of name
  vpc_security_group_ids = [aws_security_group.rds_sg.id] # Corrected to use vpc_security_group_ids

  skip_final_snapshot  = true
  publicly_accessible  = true
  parameter_group_name = aws_db_parameter_group.no_ssl_pg.name  # Attach custom parameter group


  tags = {
    Name = "postgres-chat-app"
  }
}

# S3 Object for Initialization SQL Script
resource "aws_s3_object" "init_script" {
  bucket = aws_s3_bucket.init_bucket.id
  key    = "init.sql"
  content = <<EOT
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_logs (
    id SERIAL PRIMARY KEY,
    from_user VARCHAR(255) NOT NULL,
    to_user VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOT
}

# Outputs
output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
  description = "PostgreSQL RDS endpoint"
}
