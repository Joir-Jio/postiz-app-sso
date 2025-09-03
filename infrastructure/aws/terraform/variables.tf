# Postiz SSO AWS Infrastructure Variables
# Comprehensive configuration for multi-environment deployment

# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================

variable "environment" {
  description = "Deployment environment (development, staging, production)"
  type        = string
  default     = "development"
  
  validation {
    condition = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
  
  validation {
    condition = can(regex("^[a-z]{2}-[a-z]+-[0-9]+$", var.environment))
    error_message = "AWS region must be a valid region format."
  }
}

# =============================================================================
# NETWORK CONFIGURATION
# =============================================================================

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition = can(cidrhost(var.vpc_cidr, 0))
    error_message = "VPC CIDR must be a valid IPv4 CIDR block."
  }
}

variable "domain_name" {
  description = "Domain name for the application (e.g., postiz.example.com)"
  type        = string
  
  validation {
    condition = can(regex("^[a-z0-9.-]+$", var.domain_name))
    error_message = "Domain name must be a valid domain format."
  }
}

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "postiz"
  
  validation {
    condition = can(regex("^[a-zA-Z0-9_]+$", var.db_name))
    error_message = "Database name must contain only alphanumeric characters and underscores."
  }
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "postiz_admin"
  
  validation {
    condition = length(var.db_username) >= 1 && length(var.db_username) <= 63
    error_message = "Database username must be between 1 and 63 characters."
  }
}

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================

variable "jwt_secret" {
  description = "JWT secret for application authentication"
  type        = string
  sensitive   = true
  
  validation {
    condition = length(var.jwt_secret) >= 32
    error_message = "JWT secret must be at least 32 characters long."
  }
}

variable "encryption_key" {
  description = "Encryption key for application data"
  type        = string
  sensitive   = true
  
  validation {
    condition = length(var.encryption_key) >= 32
    error_message = "Encryption key must be at least 32 characters long."
  }
}

# =============================================================================
# EXTERNAL SERVICES CONFIGURATION
# =============================================================================

# Google Cloud Storage configuration for mixed cloud strategy
variable "gcs_project_id" {
  description = "Google Cloud Project ID for GCS integration"
  type        = string
  default     = ""
}

variable "gcs_bucket_name" {
  description = "GCS bucket name for media storage"
  type        = string
  default     = ""
}

variable "gcs_service_account_key" {
  description = "GCS service account key (JSON string)"
  type        = string
  sensitive   = true
  default     = ""
}

# Social media API keys
variable "twitter_client_id" {
  description = "Twitter API client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "twitter_client_secret" {
  description = "Twitter API client secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "facebook_client_id" {
  description = "Facebook API client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "facebook_client_secret" {
  description = "Facebook API client secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "linkedin_client_id" {
  description = "LinkedIn API client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "linkedin_client_secret" {
  description = "LinkedIn API client secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "youtube_client_id" {
  description = "YouTube API client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "youtube_client_secret" {
  description = "YouTube API client secret"
  type        = string
  sensitive   = true
  default     = ""
}

# =============================================================================
# SCALING AND PERFORMANCE CONFIGURATION
# =============================================================================

variable "frontend_min_capacity" {
  description = "Minimum number of frontend tasks"
  type        = number
  default     = 1
  
  validation {
    condition = var.frontend_min_capacity >= 1 && var.frontend_min_capacity <= 10
    error_message = "Frontend min capacity must be between 1 and 10."
  }
}

variable "frontend_max_capacity" {
  description = "Maximum number of frontend tasks"
  type        = number
  default     = 5
  
  validation {
    condition = var.frontend_max_capacity >= 1 && var.frontend_max_capacity <= 50
    error_message = "Frontend max capacity must be between 1 and 50."
  }
}

variable "backend_min_capacity" {
  description = "Minimum number of backend tasks"
  type        = number
  default     = 1
  
  validation {
    condition = var.backend_min_capacity >= 1 && var.backend_min_capacity <= 10
    error_message = "Backend min capacity must be between 1 and 10."
  }
}

variable "backend_max_capacity" {
  description = "Maximum number of backend tasks"
  type        = number
  default     = 10
  
  validation {
    condition = var.backend_max_capacity >= 1 && var.backend_max_capacity <= 100
    error_message = "Backend max capacity must be between 1 and 100."
  }
}

variable "workers_min_capacity" {
  description = "Minimum number of worker tasks"
  type        = number
  default     = 1
  
  validation {
    condition = var.workers_min_capacity >= 0 && var.workers_min_capacity <= 10
    error_message = "Workers min capacity must be between 0 and 10."
  }
}

variable "workers_max_capacity" {
  description = "Maximum number of worker tasks"
  type        = number
  default     = 10
  
  validation {
    condition = var.workers_max_capacity >= 1 && var.workers_max_capacity <= 50
    error_message = "Workers max capacity must be between 1 and 50."
  }
}

# =============================================================================
# COST OPTIMIZATION CONFIGURATION
# =============================================================================

variable "enable_spot_instances" {
  description = "Enable Fargate Spot instances for cost optimization"
  type        = bool
  default     = true
}

variable "spot_allocation_strategy" {
  description = "Spot allocation strategy (balanced, cost-optimized)"
  type        = string
  default     = "balanced"
  
  validation {
    condition = contains(["balanced", "cost-optimized"], var.spot_allocation_strategy)
    error_message = "Spot allocation strategy must be balanced or cost-optimized."
  }
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit for cost alerts (USD)"
  type        = number
  default     = 500
  
  validation {
    condition = var.monthly_budget_limit > 0
    error_message = "Monthly budget limit must be greater than 0."
  }
}

variable "enable_savings_plans" {
  description = "Enable AWS Savings Plans for cost optimization"
  type        = bool
  default     = false
}

# =============================================================================
# BACKUP AND DISASTER RECOVERY
# =============================================================================

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
  
  validation {
    condition = var.backup_retention_days >= 1 && var.backup_retention_days <= 365
    error_message = "Backup retention days must be between 1 and 365."
  }
}

variable "enable_cross_region_backup" {
  description = "Enable cross-region backup for disaster recovery"
  type        = bool
  default     = false
}

variable "dr_region" {
  description = "Disaster recovery region"
  type        = string
  default     = "us-west-2"
  
  validation {
    condition = can(regex("^[a-z]{2}-[a-z]+-[0-9]+$", var.dr_region))
    error_message = "DR region must be a valid AWS region format."
  }
}

# =============================================================================
# MONITORING AND ALERTING
# =============================================================================

variable "alert_email" {
  description = "Email address for CloudWatch alerts"
  type        = string
  
  validation {
    condition = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.alert_email))
    error_message = "Alert email must be a valid email address."
  }
}

variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for RDS and ECS"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 30
  
  validation {
    condition = contains([1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653], var.log_retention_days)
    error_message = "Log retention days must be a valid CloudWatch retention period."
  }
}

# =============================================================================
# FEATURE FLAGS
# =============================================================================

variable "enable_sso" {
  description = "Enable SSO features"
  type        = bool
  default     = true
}

variable "enable_multi_tenant" {
  description = "Enable multi-tenant features"
  type        = bool
  default     = false
}

variable "enable_ai_features" {
  description = "Enable AI-powered features"
  type        = bool
  default     = false
}

variable "openai_api_key" {
  description = "OpenAI API key for AI features"
  type        = string
  sensitive   = true
  default     = ""
}

# =============================================================================
# CONTAINER CONFIGURATION
# =============================================================================

variable "container_cpu" {
  description = "CPU units for ECS tasks"
  type = object({
    frontend = number
    backend  = number
    workers  = number
    cron     = number
  })
  default = {
    frontend = 512   # 0.5 vCPU
    backend  = 1024  # 1 vCPU
    workers  = 512   # 0.5 vCPU
    cron     = 256   # 0.25 vCPU
  }
  
  validation {
    condition = alltrue([
      contains([256, 512, 1024, 2048, 4096], var.container_cpu.frontend),
      contains([256, 512, 1024, 2048, 4096], var.container_cpu.backend),
      contains([256, 512, 1024, 2048, 4096], var.container_cpu.workers),
      contains([256, 512, 1024, 2048, 4096], var.container_cpu.cron)
    ])
    error_message = "Container CPU must be valid Fargate CPU values (256, 512, 1024, 2048, 4096)."
  }
}

variable "container_memory" {
  description = "Memory (MB) for ECS tasks"
  type = object({
    frontend = number
    backend  = number
    workers  = number
    cron     = number
  })
  default = {
    frontend = 1024  # 1GB
    backend  = 2048  # 2GB
    workers  = 1024  # 1GB
    cron     = 512   # 512MB
  }
  
  validation {
    condition = alltrue([
      var.container_memory.frontend >= 512,
      var.container_memory.backend >= 1024,
      var.container_memory.workers >= 512,
      var.container_memory.cron >= 512
    ])
    error_message = "Container memory must meet minimum requirements for each service."
  }
}

# =============================================================================
# SECURITY GROUPS CONFIGURATION
# =============================================================================

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"]
  
  validation {
    condition = alltrue([for cidr in var.allowed_cidr_blocks : can(cidrhost(cidr, 0))])
    error_message = "All CIDR blocks must be valid IPv4 CIDR notation."
  }
}

variable "enable_waf" {
  description = "Enable AWS WAF for additional security"
  type        = bool
  default     = true
}

# =============================================================================
# DEVELOPMENT CONFIGURATION
# =============================================================================

variable "enable_debug_logs" {
  description = "Enable debug logging for development"
  type        = bool
  default     = false
}

variable "enable_development_tools" {
  description = "Enable development tools and endpoints"
  type        = bool
  default     = false
}

# =============================================================================
# TAGS CONFIGURATION
# =============================================================================

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "cost_center" {
  description = "Cost center for billing purposes"
  type        = string
  default     = "Engineering"
}

variable "project_owner" {
  description = "Project owner for resource management"
  type        = string
  default     = "DevOps Team"
}