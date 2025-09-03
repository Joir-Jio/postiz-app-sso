# ECS Task Definitions for Postiz SSO Application
# Optimized for AWS Fargate with security and cost optimization

# =============================================================================
# IAM ROLES FOR ECS TASKS
# =============================================================================

# ECS Task Execution Role (for pulling images and logging)
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${local.name_prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Attach AWS managed policy for ECS task execution
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional permissions for Secrets Manager and KMS
resource "aws_iam_role_policy" "ecs_task_execution_additional" {
  name = "${local.name_prefix}-ecs-task-execution-additional"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "kms:Decrypt"
        ]
        Resource = [
          aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn,
          "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${local.name_prefix}-*",
          aws_kms_key.ecs.arn
        ]
      }
    ]
  })
}

# ECS Task Role (for application permissions)
resource "aws_iam_role" "ecs_task_role" {
  name = "${local.name_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Task role policy for application access to AWS services
resource "aws_iam_role_policy" "ecs_task_role_policy" {
  name = "${local.name_prefix}-ecs-task-role-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # S3 permissions for media storage
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.assets.arn,
          "${aws_s3_bucket.assets.arn}/*"
        ]
      },
      # SES permissions for email
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      # CloudWatch permissions for logging
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          aws_cloudwatch_log_group.ecs.arn,
          "${aws_cloudwatch_log_group.ecs.arn}:*"
        ]
      },
      # Secrets Manager access for API keys
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${local.name_prefix}-*"
        ]
      }
    ]
  })
}

# =============================================================================
# SECRETS MANAGER FOR APPLICATION SECRETS
# =============================================================================

# Social media API keys secret
resource "aws_secretsmanager_secret" "social_api_keys" {
  name        = "${local.name_prefix}-social-api-keys"
  description = "Social media API keys for Postiz SSO"
  kms_key_id  = aws_kms_key.secrets.arn
  
  replica {
    region = var.dr_region
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-social-api-keys"
  })
}

resource "aws_secretsmanager_secret_version" "social_api_keys" {
  secret_id = aws_secretsmanager_secret.social_api_keys.id
  secret_string = jsonencode({
    TWITTER_CLIENT_ID     = var.twitter_client_id
    TWITTER_CLIENT_SECRET = var.twitter_client_secret
    FACEBOOK_CLIENT_ID    = var.facebook_client_id
    FACEBOOK_CLIENT_SECRET = var.facebook_client_secret
    LINKEDIN_CLIENT_ID    = var.linkedin_client_id
    LINKEDIN_CLIENT_SECRET = var.linkedin_client_secret
    YOUTUBE_CLIENT_ID     = var.youtube_client_id
    YOUTUBE_CLIENT_SECRET = var.youtube_client_secret
  })
}

# JWT and encryption keys secret
resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${local.name_prefix}-app-secrets"
  description = "Application secrets for JWT and encryption"
  kms_key_id  = aws_kms_key.secrets.arn
  
  replica {
    region = var.dr_region
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app-secrets"
  })
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    JWT_SECRET      = var.jwt_secret
    ENCRYPTION_KEY  = var.encryption_key
    REDIS_AUTH_TOKEN = random_password.redis_auth_token.result
  })
}

# GCS credentials secret (for mixed cloud strategy)
resource "aws_secretsmanager_secret" "gcs_credentials" {
  count       = var.gcs_service_account_key != "" ? 1 : 0
  name        = "${local.name_prefix}-gcs-credentials"
  description = "Google Cloud Storage credentials for mixed cloud deployment"
  kms_key_id  = aws_kms_key.secrets.arn
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-gcs-credentials"
  })
}

resource "aws_secretsmanager_secret_version" "gcs_credentials" {
  count     = var.gcs_service_account_key != "" ? 1 : 0
  secret_id = aws_secretsmanager_secret.gcs_credentials[0].id
  secret_string = jsonencode({
    GCS_PROJECT_ID              = var.gcs_project_id
    GCS_BUCKET_NAME            = var.gcs_bucket_name
    GOOGLE_APPLICATION_CREDENTIALS = var.gcs_service_account_key
  })
}

# =============================================================================
# ECS TASK DEFINITIONS
# =============================================================================

# Frontend Task Definition (Next.js)
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${local.name_prefix}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.container_cpu.frontend
  memory                  = var.container_memory.frontend
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn          = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.name_prefix}-frontend:latest"
      
      portMappings = [
        {
          containerPort = 4200
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "NEXT_PUBLIC_BACKEND_URL"
          value = "https://api.${var.domain_name}"
        },
        {
          name  = "NEXT_PUBLIC_CDN_URL"
          value = "https://${aws_cloudfront_distribution.assets.domain_name}"
        },
        {
          name  = "NEXT_PUBLIC_ENABLE_SSO"
          value = tostring(var.enable_sso)
        }
      ]

      secrets = [
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:JWT_SECRET::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:4200/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }

      # Security: run as non-root user
      user = "1001:1001"

      # Resource limits for cost optimization
      memoryReservation = var.container_memory.frontend / 2
      
      # Essential container
      essential = true
    }
  ])

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-frontend-task"
  })
}

# Backend Task Definition (NestJS)
resource "aws_ecs_task_definition" "backend" {
  family                   = "${local.name_prefix}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.container_cpu.backend
  memory                  = var.container_memory.backend
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn          = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.name_prefix}-backend:latest"
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "PORT"
          value = "3000"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${aws_rds_cluster.aurora_postgresql.master_username}:PASSWORD_PLACEHOLDER@${aws_rds_cluster.aurora_postgresql.endpoint}:${aws_rds_cluster.aurora_postgresql.port}/${aws_rds_cluster.aurora_postgresql.database_name}"
        },
        {
          name  = "REDIS_URL"
          value = "redis://:AUTH_TOKEN_PLACEHOLDER@${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "AWS_S3_BUCKET"
          value = aws_s3_bucket.assets.id
        },
        {
          name  = "FRONTEND_URL"
          value = "https://${var.domain_name}"
        },
        {
          name  = "ENABLE_SSO"
          value = tostring(var.enable_sso)
        },
        {
          name  = "ENABLE_MULTI_TENANT"
          value = tostring(var.enable_multi_tenant)
        }
      ]

      secrets = [
        # Database password from AWS managed secret
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn}:password::"
        },
        # Application secrets
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:JWT_SECRET::"
        },
        {
          name      = "ENCRYPTION_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:ENCRYPTION_KEY::"
        },
        {
          name      = "REDIS_AUTH_TOKEN"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:REDIS_AUTH_TOKEN::"
        },
        # Social media API keys
        {
          name      = "TWITTER_CLIENT_ID"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:TWITTER_CLIENT_ID::"
        },
        {
          name      = "TWITTER_CLIENT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:TWITTER_CLIENT_SECRET::"
        },
        {
          name      = "FACEBOOK_CLIENT_ID"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:FACEBOOK_CLIENT_ID::"
        },
        {
          name      = "FACEBOOK_CLIENT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:FACEBOOK_CLIENT_SECRET::"
        }
      ]

      # Add GCS secrets if configured
      secrets = concat([
        # Database password from AWS managed secret
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn}:password::"
        },
        # Application secrets
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:JWT_SECRET::"
        },
        {
          name      = "ENCRYPTION_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:ENCRYPTION_KEY::"
        },
        {
          name      = "REDIS_AUTH_TOKEN"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:REDIS_AUTH_TOKEN::"
        }
      ], var.gcs_service_account_key != "" ? [
        {
          name      = "GCS_PROJECT_ID"
          valueFrom = "${aws_secretsmanager_secret.gcs_credentials[0].arn}:GCS_PROJECT_ID::"
        },
        {
          name      = "GCS_BUCKET_NAME"
          valueFrom = "${aws_secretsmanager_secret.gcs_credentials[0].arn}:GCS_BUCKET_NAME::"
        },
        {
          name      = "GOOGLE_APPLICATION_CREDENTIALS"
          valueFrom = "${aws_secretsmanager_secret.gcs_credentials[0].arn}:GOOGLE_APPLICATION_CREDENTIALS::"
        }
      ] : [])

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "backend"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 120
      }

      # Security: run as non-root user
      user = "1001:1001"

      # Resource limits
      memoryReservation = var.container_memory.backend / 2
      
      essential = true
    }
  ])

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-backend-task"
  })
}

# Workers Task Definition (Background tasks)
resource "aws_ecs_task_definition" "workers" {
  family                   = "${local.name_prefix}-workers"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.container_cpu.workers
  memory                  = var.container_memory.workers
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn          = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "workers"
      image = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.name_prefix}-workers:latest"
      
      # No port mappings for workers (internal service)
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "SERVICE_NAME"
          value = "workers"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${aws_rds_cluster.aurora_postgresql.master_username}:PASSWORD_PLACEHOLDER@${aws_rds_cluster.aurora_postgresql.endpoint}:${aws_rds_cluster.aurora_postgresql.port}/${aws_rds_cluster.aurora_postgresql.database_name}"
        },
        {
          name  = "REDIS_URL"
          value = "redis://:AUTH_TOKEN_PLACEHOLDER@${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "AWS_S3_BUCKET"
          value = aws_s3_bucket.assets.id
        },
        {
          name  = "QUEUE_CONCURRENCY"
          value = var.environment == "production" ? "10" : "5"
        }
      ]

      secrets = [
        # Database password
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn}:password::"
        },
        # Redis auth token
        {
          name      = "REDIS_AUTH_TOKEN"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:REDIS_AUTH_TOKEN::"
        },
        # Social media API keys for background tasks
        {
          name      = "TWITTER_CLIENT_ID"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:TWITTER_CLIENT_ID::"
        },
        {
          name      = "TWITTER_CLIENT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.social_api_keys.arn}:TWITTER_CLIENT_SECRET::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "workers"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f 'workers' || exit 1"]
        interval    = 60
        timeout     = 10
        retries     = 3
        startPeriod = 120
      }

      # Security: run as non-root user
      user = "1001:1001"

      # Resource limits
      memoryReservation = var.container_memory.workers / 2
      
      essential = true
    }
  ])

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-workers-task"
  })
}

# Cron Task Definition (Scheduled tasks)
resource "aws_ecs_task_definition" "cron" {
  family                   = "${local.name_prefix}-cron"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.container_cpu.cron
  memory                  = var.container_memory.cron
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn          = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "cron"
      image = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.name_prefix}-cron:latest"
      
      # No port mappings for cron (internal service)
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "SERVICE_NAME"
          value = "cron"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${aws_rds_cluster.aurora_postgresql.master_username}:PASSWORD_PLACEHOLDER@${aws_rds_cluster.aurora_postgresql.endpoint}:${aws_rds_cluster.aurora_postgresql.port}/${aws_rds_cluster.aurora_postgresql.database_name}"
        },
        {
          name  = "REDIS_URL"
          value = "redis://:AUTH_TOKEN_PLACEHOLDER@${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
        }
      ]

      secrets = [
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_rds_cluster.aurora_postgresql.master_user_secret[0].secret_arn}:password::"
        },
        {
          name      = "REDIS_AUTH_TOKEN"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:REDIS_AUTH_TOKEN::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "cron"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pgrep -f 'cron' || exit 1"]
        interval    = 300  # 5 minutes
        timeout     = 10
        retries     = 2
        startPeriod = 60
      }

      # Security: run as non-root user
      user = "1001:1001"

      # Resource limits
      memoryReservation = var.container_memory.cron / 2
      
      essential = true
    }
  ])

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-cron-task"
  })
}