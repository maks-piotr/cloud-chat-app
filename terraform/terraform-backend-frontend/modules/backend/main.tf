resource "aws_instance" "backend" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name               = var.key_name

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
    Name = var.name
  }
}

resource "aws_security_group" "backend_sg" {
  vpc_id      = var.vpc_id
  name        = "backend-sg"
  description = "Main security group for backend"

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

resource "aws_eip_association" "backend_eip_association" {
  allocation_id = var.allocation_id
  instance_id   = aws_instance.backend.id
}
