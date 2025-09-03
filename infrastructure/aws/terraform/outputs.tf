# Postiz SSO AWS Infrastructure Outputs
# Export key values for application configuration and monitoring

# =============================================================================
# NETWORK OUTPUTS
# =============================================================================

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnets
}

output "database_subnets" {
  description = "IDs of the database subnets"
  value       = module.vpc.database_subnets
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = module.vpc.natgw_ids
}

# =============================================================================
# LOAD BALANCER OUTPUTS
# =============================================================================

output "load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "load_balancer_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.main.zone_id
}

output "load_balancer_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.main.arn
}

output "target_group_arns" {
  description = "ARNs of the target groups"
  value = {
    frontend = aws_lb_target_group.frontend.arn
    backend  = aws_lb_target_group.backend.arn
  }
}

# =============================================================================
# SSL CERTIFICATE OUTPUTS
# =============================================================================

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.main.arn
}

output "acm_certificate_status" {
  description = "Status of the ACM certificate"
  value       = aws_acm_certificate.main.status
}

output "cloudfront_certificate_arn" {
  description = "ARN of the CloudFront ACM certificate"
  value       = aws_acm_certificate.cloudfront.arn
}

# =============================================================================
# DATABASE OUTPUTS
# =============================================================================

output "aurora_cluster_id" {
  description = "Aurora cluster identifier"
  value       = aws_rds_cluster.aurora_postgresql.id
}

output "aurora_cluster_endpoint" {
  description = "Aurora cluster endpoint"
  value       = aws_rds_cluster.aurora_postgresql.endpoint
  sensitive   = true
}

output "aurora_cluster_reader_endpoint" {
  description = "Aurora cluster reader endpoint"
  value       = aws_rds_cluster.aurora_postgresql.reader_endpoint
  sensitive   = true
}

output "aurora_cluster_port" {
  description = "Aurora cluster port"
  value       = aws_rds_cluster.aurora_postgresql.port
}

output "aurora_database_name" {
  description = "Aurora database name"
  value       = aws_rds_cluster.aurora_postgresql.database_name
}

output "aurora_master_username" {
  description = "Aurora master username"
  value       = aws_rds_cluster.aurora_postgresql.master_username
  sensitive   = true
}

output "aurora_cluster_resource_id" {
  description = "Aurora cluster resource ID"
  value       = aws_rds_cluster.aurora_postgresql.cluster_resource_id
}

output "aurora_cluster_members" {
  description = "Aurora cluster member instances"
  value       = aws_rds_cluster.aurora_postgresql.cluster_members
}

# Aurora Secrets Manager secret
output "aurora_master_user_secret" {
  description = "Aurora master user secret managed by AWS"
  value = {
    secret_arn    = aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn
    secret_status = aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_status
  }
  sensitive = true
}

# =============================================================================
# REDIS CACHE OUTPUTS
# =============================================================================

output "elasticache_cluster_id" {
  description = "ElastiCache cluster identifier"
  value       = aws_elasticache_replication_group.redis.id
}

output "elasticache_primary_endpoint" {
  description = "ElastiCache primary endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive   = true
}

output "elasticache_configuration_endpoint" {
  description = "ElastiCache configuration endpoint"
  value       = aws_elasticache_replication_group.redis.configuration_endpoint_address
  sensitive   = true
}

output "elasticache_port" {
  description = "ElastiCache port"
  value       = aws_elasticache_replication_group.redis.port
}

output "elasticache_auth_token" {
  description = "ElastiCache auth token"
  value       = random_password.redis_auth_token.result
  sensitive   = true
}

# =============================================================================
# ECS OUTPUTS
# =============================================================================

output "ecs_cluster_id" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_task_definitions" {
  description = "ECS task definition ARNs"
  value = {
    frontend = aws_ecs_task_definition.frontend.arn
    backend  = aws_ecs_task_definition.backend.arn
    workers  = aws_ecs_task_definition.workers.arn
    cron     = aws_ecs_task_definition.cron.arn
  }
}

output "ecs_service_names" {
  description = "ECS service names"
  value = {
    frontend = module.ecs_frontend.service_name
    backend  = module.ecs_backend.service_name
    workers  = module.ecs_workers.service_name
  }
}

# =============================================================================
# S3 AND CLOUDFRONT OUTPUTS
# =============================================================================

output "s3_assets_bucket_name" {
  description = "Name of the S3 assets bucket"
  value       = aws_s3_bucket.assets.id
}

output "s3_assets_bucket_arn" {
  description = "ARN of the S3 assets bucket"
  value       = aws_s3_bucket.assets.arn
}

output "s3_assets_bucket_domain_name" {
  description = "Domain name of the S3 assets bucket"
  value       = aws_s3_bucket.assets.bucket_domain_name
}

output "s3_access_logs_bucket_name" {
  description = "Name of the S3 access logs bucket"
  value       = aws_s3_bucket.access_logs.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.assets.id
}

output "cloudfront_distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.assets.domain_name
}

output "cloudfront_distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  value       = aws_cloudfront_distribution.assets.hosted_zone_id
}

# =============================================================================
# KMS OUTPUTS
# =============================================================================

output "kms_key_ids" {
  description = "KMS key IDs for different services"
  value = {
    rds         = aws_kms_key.rds.id
    elasticache = aws_kms_key.elasticache.id
    s3          = aws_kms_key.s3.id
    ecs         = aws_kms_key.ecs.id
    logs        = aws_kms_key.logs.id
    sns         = aws_kms_key.sns.id
  }
  sensitive = true
}

output "kms_key_arns" {
  description = "KMS key ARNs for different services"
  value = {
    rds         = aws_kms_key.rds.arn
    elasticache = aws_kms_key.elasticache.arn
    s3          = aws_kms_key.s3.arn
    ecs         = aws_kms_key.ecs.arn
    logs        = aws_kms_key.logs.arn
    sns         = aws_kms_key.sns.arn
  }
  sensitive = true
}

# =============================================================================
# IAM OUTPUTS
# =============================================================================

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS task role"
  value       = aws_iam_role.ecs_task_role.arn
}

# =============================================================================
# MONITORING OUTPUTS
# =============================================================================

output "cloudwatch_log_groups" {
  description = "CloudWatch log group names"
  value = {
    ecs   = aws_cloudwatch_log_group.ecs.name
    redis = aws_cloudwatch_log_group.redis.name
  }
}

output "sns_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

# =============================================================================
# SECURITY GROUP OUTPUTS
# =============================================================================

output "security_group_ids" {
  description = "Security group IDs"
  value = {
    alb          = aws_security_group.alb.id
    ecs_tasks    = aws_security_group.ecs_tasks.id
    aurora       = aws_security_group.aurora.id
    elasticache  = aws_security_group.elasticache.id
  }
}

# =============================================================================
# APPLICATION CONFIGURATION OUTPUTS
# =============================================================================

output "application_urls" {
  description = "Application URLs for different environments"
  value = {
    frontend = "https://${var.domain_name}"
    backend  = "https://api.${var.domain_name}"
    cdn      = "https://${aws_cloudfront_distribution.assets.domain_name}"
  }
}

# Database connection string (without password)
output "database_connection_info" {
  description = "Database connection information"
  value = {
    host     = aws_rds_cluster.aurora_postgresql.endpoint
    port     = aws_rds_cluster.aurora_postgresql.port
    database = aws_rds_cluster.aurora_postgresql.database_name
    username = aws_rds_cluster.aurora_postgresql.master_username
  }
  sensitive = true
}

# Redis connection string (without auth token)
output "redis_connection_info" {
  description = "Redis connection information"
  value = {
    host = aws_elasticache_replication_group.redis.primary_endpoint_address
    port = aws_elasticache_replication_group.redis.port
  }
  sensitive = true
}

# =============================================================================
# COST OPTIMIZATION OUTPUTS
# =============================================================================

output "cost_optimization_features" {
  description = "Enabled cost optimization features"
  value = {
    spot_instances_enabled     = var.enable_spot_instances
    single_nat_gateway        = var.environment != "production" ? true : false
    s3_lifecycle_enabled      = true
    aurora_serverless_v2      = true
    cloudfront_price_class    = var.environment == "production" ? "PriceClass_All" : "PriceClass_100"
  }
}

# =============================================================================
# DISASTER RECOVERY OUTPUTS
# =============================================================================

output "backup_configuration" {
  description = "Backup and disaster recovery configuration"
  value = {
    aurora_backup_retention    = aws_rds_cluster.aurora_postgresql.backup_retention_period
    aurora_backup_window       = aws_rds_cluster.aurora_postgresql.backup_window
    redis_snapshot_retention   = aws_elasticache_replication_group.redis.snapshot_retention_limit
    redis_snapshot_window      = aws_elasticache_replication_group.redis.snapshot_window
    cross_region_backup        = var.enable_cross_region_backup
    disaster_recovery_region   = var.dr_region
  }
}

# =============================================================================
# ENVIRONMENT CONFIGURATION FOR APPLICATION
# =============================================================================

output "environment_variables" {
  description = "Environment variables for application deployment"
  value = {
    # Database
    DATABASE_URL = "postgresql://${aws_rds_cluster.aurora_postgresql.master_username}:PASSWORD@${aws_rds_cluster.aurora_postgresql.endpoint}:${aws_rds_cluster.aurora_postgresql.port}/${aws_rds_cluster.aurora_postgresql.database_name}"
    
    # Redis
    REDIS_URL = "redis://AUTH_TOKEN@${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
    
    # AWS Configuration
    AWS_REGION               = var.aws_region
    AWS_S3_BUCKET            = aws_s3_bucket.assets.id
    AWS_CLOUDFRONT_DOMAIN    = aws_cloudfront_distribution.assets.domain_name
    
    # Application URLs
    FRONTEND_URL            = "https://${var.domain_name}"
    BACKEND_URL             = "https://api.${var.domain_name}"
    CDN_URL                 = "https://${aws_cloudfront_distribution.assets.domain_name}"
    
    # Security
    ENABLE_HTTPS            = "true"
    ENABLE_CORS             = "true"
    ENABLE_HELMET           = "true"
    ENABLE_RATE_LIMITING    = "true"
    
    # Feature flags
    ENABLE_SSO              = tostring(var.enable_sso)
    ENABLE_MULTI_TENANT     = tostring(var.enable_multi_tenant)
    ENABLE_AI_FEATURES      = tostring(var.enable_ai_features)
    
    # Environment
    NODE_ENV                = var.environment
    ENVIRONMENT             = var.environment
  }
  sensitive = true
}

# =============================================================================
# DEPLOYMENT INFORMATION
# =============================================================================

output "deployment_info" {
  description = "Deployment information and next steps"
  value = {
    environment          = var.environment
    region              = var.aws_region
    deployment_time     = timestamp()
    terraform_workspace = terraform.workspace
    
    next_steps = [
      "1. Update Route 53 DNS records to point to ${aws_lb.main.dns_name}",
      "2. Retrieve database password from AWS Secrets Manager",
      "3. Configure application environment variables using the provided values",
      "4. Deploy application containers to ECS using the task definitions",
      "5. Monitor application health through CloudWatch dashboards",
      "6. Set up SSL certificate validation in ACM",
      "7. Configure social media API keys in AWS Secrets Manager"
    ]
    
    important_notes = [
      "Database password is managed by AWS Secrets Manager",
      "Redis auth token is generated and stored securely",
      "All data is encrypted at rest and in transit",
      "Cost optimization features are enabled for ${var.environment} environment",
      "Monitoring and alerting are configured for production readiness"
    ]
  }
}