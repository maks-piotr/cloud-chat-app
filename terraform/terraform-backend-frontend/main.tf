provider "aws" {
  region = "us-east-1"
}

module "network" {
  source       = "./modules/network"
  vpc_cidr     = "10.0.0.0/16"
  subnet_cidr  = "10.0.1.0/24"
  vpc_name     = "projekt1-vpc"
  subnet_name  = "projekt1-public-subnet"
}

module "frontend" {
  source        = "./modules/frontend"
  ami           = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  key_name      = "vockey"
  name          = "FRONTEND"
  subnet_id     = module.network.public_subnet_id
  vpc_id        = module.network.vpc_id
}

module "backend" {
  source        = "./modules/backend"
  ami           = "ami-0866a3c8686eaeeba"
  instance_type = "t2.micro"
  key_name      = "vockey"
  name          = "BACKEND"
  subnet_id     = module.network.public_subnet_id
  vpc_id        = module.network.vpc_id
  allocation_id = "eipalloc-07dd912e80a39a5b2"
}
