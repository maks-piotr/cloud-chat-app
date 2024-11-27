provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "FRONTEND" {
  ami                    = "ami-0866a3c8686eaeeba"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.frontend-sg.id]
  key_name               = "vockey"
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo docker pull dockerowicz/chmury-frontend:latest
              sudo docker run -d \
                -p 80:80 \
                -e API_BASE_URL=http://44.208.26.126:8080 \
                -e USER_POOL_ID=us-east-1_uqVYJ45ln \
                -e USER_POOL_CLIENT_ID=7s8cbbjpdgdnv603nerg2nf5eg \
                -e LOGIN_WITH_USERNAME=true \
                dockerowicz/chmury-frontend:latest
            EOF
  tags = {
    Name = "FRONTEND"
  }
}

resource "aws_security_group" "frontend-sg" {
  name        = "frontend-sg"
  description = "Main security group"

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
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
    Name = "frontend-sg"
  }
}