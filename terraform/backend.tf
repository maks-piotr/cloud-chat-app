provider "aws" {
  region = "us-east-1"
}

resource "aws_eip_association" "backend_eip_association" {
  allocation_id = "eipalloc-07dd912e80a39a5b2"
  instance_id   = aws_instance.BACKEND.id
}

resource "aws_instance" "BACKEND" {
  ami                    = "ami-0866a3c8686eaeeba"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.backend-sg.id]
  key_name               = "vockey"
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo docker pull dockerowicz/chmury-backend:latest
              sudo docker run -d -p 8080:8080 dockerowicz/chmury-backend:latest
            EOF
  tags = {
    Name = "BACKEND"
  }
}

resource "aws_security_group" "backend-sg" {
  name        = "backend-sg"
  description = "Main security group"

  ingress {
    description = "Allow HTTP"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "backend-sg"
  }
}