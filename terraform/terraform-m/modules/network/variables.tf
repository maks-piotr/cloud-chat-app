variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the public subnet"
  default     = "10.0.1.0/24"
}

variable "vpc_name" {
  description = "Name of the VPC"
  default     = "projekt1-vpc"
}

variable "subnet_name" {
  description = "Name of the public subnet"
  default     = "projekt1-public-subnet"
}
