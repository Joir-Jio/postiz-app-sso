# Postiz SSO AWS Infrastructure - Optimized Production Deployment
# Author: Claude Code - AWS Architect
# Architecture: ECS Fargate + Aurora + ElastiCache + ALB + CloudFront + S3
# Focus: Cost optimization, security, scalability, and disaster recovery

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Use S3 backend for state management
  backend "s3" {
    bucket         = "postiz-terraform-state-${random_id.state_bucket_suffix.hex}"
    key            = "postiz-sso/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "postiz-terraform-lock"
  }
}

# Generate random suffix for globally unique resources
resource "random_id" "state_bucket_suffix" {
  byte_length = 4
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project           = "Postiz-SSO"
      Environment       = var.environment
      Owner             = "Infrastructure"
      CostCenter        = "Engineering"
      ManagedBy         = "Terraform"
      SecurityLevel     = var.environment == "production" ? "high" : "medium"
      BackupSchedule    = var.environment == "production" ? "daily" : "weekly"
      MonitoringLevel   = var.environment == "production" ? "enhanced" : "basic"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  name_prefix = "postiz-${var.environment}"
  
  # Multi-AZ configuration for high availability
  azs = slice(data.aws_availability_zones.available.names, 0, var.environment == "production" ? 3 : 2)
  
  # Cost optimization: different instance types per environment
  ecs_instance_types = var.environment == "production" ? 
    ["t3.medium", "t3.large"] : 
    ["t3.small", "t3.medium"]
  
  # Database configuration per environment
  db_config = var.environment == "production" ? {
    instance_class      = "db.r6g.large"
    allocated_storage   = 100
    max_allocated_storage = 1000
    backup_retention    = 30
    multi_az           = true
    deletion_protection = true
  } : {
    instance_class      = "db.r6g.large"
    allocated_storage   = 20
    max_allocated_storage = 100
    backup_retention    = 7
    multi_az           = false
    deletion_protection = false
  }
  
  # Redis configuration per environment
  redis_config = var.environment == "production" ? {
    node_type         = "cache.r6g.large"
    num_cache_nodes   = 2
    automatic_failover = true
  } : {
    node_type         = "cache.r6g.large"
    num_cache_nodes   = 1
    automatic_failover = false
  }
  
  # Common tags for all resources
  common_tags = {
    Project     = "Postiz-SSO"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# NETWORKING - VPC, Subnets, Security Groups
# =============================================================================

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${local.name_prefix}-vpc"
  cidr = var.vpc_cidr

  azs              = local.azs
  private_subnets  = [for i, az in local.azs : cidrsubnet(var.vpc_cidr, 4, i)]
  public_subnets   = [for i, az in local.azs : cidrsubnet(var.vpc_cidr, 4, i + length(local.azs))]
  database_subnets = [for i, az in local.azs : cidrsubnet(var.vpc_cidr, 4, i + 2 * length(local.azs))]

  enable_nat_gateway   = true
  enable_vpn_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Cost optimization: single NAT gateway for non-production
  single_nat_gateway = var.environment != "production"
  
  # Enhanced monitoring for production
  enable_flow_log                      = var.environment == "production"
  create_flow_log_cloudwatch_log_group = var.environment == "production"
  create_flow_log_cloudwatch_iam_role  = var.environment == "production"

  tags = local.common_tags
}

# =============================================================================
# SECURITY GROUPS
# =============================================================================

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-sg"
  })
}

# ECS Service Security Group
resource "aws_security_group" "ecs_tasks" {
  name        = "${local.name_prefix}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Frontend from ALB"
    from_port       = 4200
    to_port         = 4200
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Backend from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Inter-service communication
  ingress {
    description = "Inter-service communication"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-ecs-tasks-sg"
  })
}

# Aurora Security Group
resource "aws_security_group" "aurora" {
  name        = "${local.name_prefix}-aurora-sg"
  description = "Security group for Aurora PostgreSQL cluster"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-sg"
  })
}

# ElastiCache Security Group
resource "aws_security_group" "elasticache" {
  name        = "${local.name_prefix}-elasticache-sg"
  description = "Security group for ElastiCache Redis cluster"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Redis from ECS tasks"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-elasticache-sg"
  })
}

# =============================================================================
# DATABASE - Aurora PostgreSQL Serverless v2
# =============================================================================

# Aurora Subnet Group
resource "aws_db_subnet_group" "aurora" {
  name       = "${local.name_prefix}-aurora-subnet-group"
  subnet_ids = module.vpc.database_subnets

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-subnet-group"
  })
}

# Aurora cluster with cost-optimized serverless v2
resource "aws_rds_cluster" "aurora_postgresql" {
  cluster_identifier        = "${local.name_prefix}-aurora-cluster"
  engine                   = "aurora-postgresql"
  engine_version           = "15.5"
  engine_mode              = "provisioned"
  database_name            = var.db_name
  master_username          = var.db_username
  manage_master_user_password = true  # AWS managed secret
  
  db_subnet_group_name   = aws_db_subnet_group.aurora.name
  vpc_security_group_ids = [aws_security_group.aurora.id]
  
  # Cost optimization with serverless v2
  serverlessv2_scaling_configuration {
    max_capacity = var.environment == "production" ? 16 : 2
    min_capacity = 0.5
  }

  # Backup configuration
  backup_retention_period   = local.db_config.backup_retention
  backup_window            = "03:00-04:00"
  maintenance_window       = "sun:04:00-sun:05:00"
  preferred_backup_window  = "03:00-04:00"
  
  # Security and encryption
  storage_encrypted        = true
  kms_key_id              = aws_kms_key.rds.arn
  deletion_protection     = local.db_config.deletion_protection
  
  # Performance insights
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  # Final snapshot
  skip_final_snapshot       = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "${local.name_prefix}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-cluster"
    BackupSchedule = var.environment == "production" ? "daily" : "weekly"
  })

  lifecycle {
    prevent_destroy = true
  }
}

# Aurora instances with burstable performance
resource "aws_rds_cluster_instance" "aurora_postgresql_instances" {
  count              = var.environment == "production" ? 2 : 1
  identifier         = "${local.name_prefix}-aurora-instance-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.aurora_postgresql.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_postgresql.engine
  engine_version     = aws_rds_cluster.aurora_postgresql.engine_version
  
  # Performance Insights for monitoring
  performance_insights_enabled    = var.environment == "production"
  performance_insights_kms_key_id = var.environment == "production" ? aws_kms_key.rds.arn : null
  
  # Enhanced monitoring
  monitoring_interval = var.environment == "production" ? 60 : 0
  monitoring_role_arn = var.environment == "production" ? aws_iam_role.rds_enhanced_monitoring[0].arn : null

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-instance-${count.index + 1}"
  })
}

# =============================================================================
# REDIS CACHE - ElastiCache with cost optimization
# =============================================================================

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.name_prefix}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-redis-subnet-group"
  })
}

# ElastiCache Parameter Group for performance tuning
resource "aws_elasticache_parameter_group" "redis" {
  family = "redis7.x"
  name   = "${local.name_prefix}-redis-params"

  # Optimize for SSO and session management
  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
  
  parameter {
    name  = "timeout"
    value = "300"
  }

  tags = local.common_tags
}

# ElastiCache Redis Cluster
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id         = "${local.name_prefix}-redis"
  description                  = "Redis cluster for Postiz SSO sessions and caching"
  
  # Cost-optimized configuration
  node_type                    = local.redis_config.node_type
  port                        = 6379
  parameter_group_name        = aws_elasticache_parameter_group.redis.name
  subnet_group_name           = aws_elasticache_subnet_group.redis.name
  security_group_ids          = [aws_security_group.elasticache.id]
  
  # High availability configuration
  num_cache_clusters         = local.redis_config.num_cache_nodes
  automatic_failover_enabled = local.redis_config.automatic_failover
  multi_az_enabled          = var.environment == "production"
  
  # Security and encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_update_strategy = "SET"
  auth_token                = random_password.redis_auth_token.result
  kms_key_id                = aws_kms_key.elasticache.arn
  
  # Backup configuration
  snapshot_retention_limit = var.environment == "production" ? 30 : 5
  snapshot_window         = "03:00-05:00"
  maintenance_window      = "sun:05:00-sun:07:00"
  
  # Auto minor version upgrade for security patches
  auto_minor_version_upgrade = true
  
  # CloudWatch logs
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis.name
    destination_type = "cloudwatch-logs"
    log_format      = "json"
    log_type        = "slow-log"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-redis"
  })
}

# Redis auth token
resource "random_password" "redis_auth_token" {
  length  = 32
  special = true
}

# =============================================================================
# CONTAINER ORCHESTRATION - ECS with Fargate
# =============================================================================

# ECS Cluster with cost optimization
resource "aws_ecs_cluster" "main" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = var.environment == "production" ? "enabled" : "disabled"
  }

  # Cost optimization with Fargate Spot for non-production
  configuration {
    execute_command_configuration {
      kms_key_id = aws_kms_key.ecs.arn
      logging    = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs.name
      }
    }
  }

  tags = local.common_tags
}

# ECS Service - Frontend (Next.js)
module "ecs_frontend" {
  source = "./modules/ecs-service"

  name             = "${local.name_prefix}-frontend"
  cluster_id       = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.frontend.arn
  desired_count    = var.environment == "production" ? 2 : 1

  network_configuration = {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets        = module.vpc.private_subnets
  }

  load_balancer = {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 4200
  }

  # Auto scaling configuration
  enable_autoscaling = true
  min_capacity      = var.environment == "production" ? 2 : 1
  max_capacity      = var.environment == "production" ? 10 : 3
  
  # Cost optimization: use Fargate Spot for development
  capacity_provider_strategy = var.environment == "production" ? [
    {
      capacity_provider = "FARGATE"
      weight           = 100
      base            = 2
    }
  ] : [
    {
      capacity_provider = "FARGATE_SPOT"
      weight           = 100
      base            = 0
    }
  ]

  tags = local.common_tags
}

# ECS Service - Backend (NestJS)
module "ecs_backend" {
  source = "./modules/ecs-service"

  name             = "${local.name_prefix}-backend"
  cluster_id       = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.backend.arn
  desired_count    = var.environment == "production" ? 2 : 1

  network_configuration = {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets        = module.vpc.private_subnets
  }

  load_balancer = {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3000
  }

  # Auto scaling with more aggressive scaling for API
  enable_autoscaling = true
  min_capacity      = var.environment == "production" ? 2 : 1
  max_capacity      = var.environment == "production" ? 20 : 5

  # Cost optimization
  capacity_provider_strategy = var.environment == "production" ? [
    {
      capacity_provider = "FARGATE"
      weight           = 70
      base            = 2
    },
    {
      capacity_provider = "FARGATE_SPOT"
      weight           = 30
      base            = 0
    }
  ] : [
    {
      capacity_provider = "FARGATE_SPOT"
      weight           = 100
      base            = 0
    }
  ]

  tags = local.common_tags
}

# ECS Service - Workers (Background tasks)
module "ecs_workers" {
  source = "./modules/ecs-service"

  name             = "${local.name_prefix}-workers"
  cluster_id       = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.workers.arn
  desired_count    = var.environment == "production" ? 2 : 1

  network_configuration = {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets        = module.vpc.private_subnets
  }

  # No load balancer for workers
  load_balancer = null

  # Auto scaling based on queue depth
  enable_autoscaling = true
  min_capacity      = 1
  max_capacity      = var.environment == "production" ? 10 : 3

  # Cost optimization: heavy use of Spot instances for workers
  capacity_provider_strategy = [
    {
      capacity_provider = "FARGATE_SPOT"
      weight           = 100
      base            = 0
    }
  ]

  tags = local.common_tags
}

# =============================================================================
# LOAD BALANCER - Application Load Balancer
# =============================================================================

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = module.vpc.public_subnets

  # Cost optimization: deletion protection only in production
  enable_deletion_protection = var.environment == "production"
  
  # Enhanced logging for production
  access_logs {
    bucket  = aws_s3_bucket.access_logs.id
    prefix  = "alb"
    enabled = var.environment == "production"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb"
  })
}

# Target Groups
resource "aws_lb_target_group" "frontend" {
  name     = "${local.name_prefix}-frontend-tg"
  port     = 4200
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path               = "/api/health"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 3
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-frontend-tg"
  })
}

resource "aws_lb_target_group" "backend" {
  name     = "${local.name_prefix}-backend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path               = "/health"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 3
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-backend-tg"
  })
}

# ACM Certificate for SSL/TLS
resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  subject_alternative_names = [
    "*.${var.domain_name}"
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-cert"
  })
}

# ALB Listeners
resource "aws_lb_listener" "frontend_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  tags = local.common_tags
}

resource "aws_lb_listener" "backend_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    host_header {
      values = ["api.${var.domain_name}"]
    }
  }

  tags = local.common_tags
}

# HTTP to HTTPS redirect
resource "aws_lb_listener" "redirect_http_to_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# =============================================================================
# CONTENT DELIVERY - CloudFront + S3
# =============================================================================

# S3 Bucket for static assets
resource "aws_s3_bucket" "assets" {
  bucket        = "${local.name_prefix}-assets-${random_id.bucket_suffix.hex}"
  force_destroy = var.environment != "production"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-assets"
    Purpose = "Static Assets"
  })
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 bucket versioning
resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = var.environment == "production" ? "Enabled" : "Suspended"
  }
}

# S3 bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# S3 bucket lifecycle for cost optimization
resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    id     = "asset_lifecycle"
    status = "Enabled"

    # Move to IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Delete old versions after 365 days
    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "assets" {
  name                              = "${local.name_prefix}-assets-oac"
  description                       = "OAC for Postiz assets bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution for global content delivery
resource "aws_cloudfront_distribution" "assets" {
  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.assets.id
    origin_id                = "S3-${aws_s3_bucket.assets.id}"
  }

  # Cost optimization: use cheaper edge locations for development
  price_class = var.environment == "production" ? "PriceClass_All" : "PriceClass_100"
  
  enabled             = true
  is_ipv6_enabled    = true
  comment            = "Postiz SSO Assets CDN - ${var.environment}"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.assets.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    # Security headers
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL certificate
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cloudfront.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-cloudfront"
  })
}

# CloudFront security headers policy
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "${local.name_prefix}-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = false
    }

    content_type_options {
      override = false
    }

    frame_options {
      frame_option = "DENY"
      override     = false
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = false
    }
  }
}

# =============================================================================
# MONITORING AND ALERTING
# =============================================================================

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/aws/ecs/${local.name_prefix}"
  retention_in_days = var.environment == "production" ? 30 : 14
  kms_key_id       = aws_kms_key.logs.arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "redis" {
  name              = "/aws/elasticache/${local.name_prefix}"
  retention_in_days = var.environment == "production" ? 30 : 14
  kms_key_id       = aws_kms_key.logs.arn

  tags = local.common_tags
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name         = "${local.name_prefix}-alerts"
  display_name = "Postiz SSO Alerts - ${var.environment}"
  
  kms_master_key_id = aws_kms_key.sns.arn

  tags = local.common_tags
}

# Cost alert
resource "aws_budgets_budget" "cost_alert" {
  count = var.environment == "production" ? 1 : 0
  
  name         = "${local.name_prefix}-monthly-budget"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
  time_period_start = formatdate("YYYY-MM-01_00:00", timestamp())

  cost_filters = {
    Tag = ["Project:Postiz-SSO"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }

  tags = local.common_tags
}