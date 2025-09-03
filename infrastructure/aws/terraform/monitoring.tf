# Postiz SSO Monitoring and Alerting Configuration
# Comprehensive observability stack with cost-optimized monitoring

# =============================================================================
# CLOUDWATCH DASHBOARDS
# =============================================================================

# Main application dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.name_prefix}-main-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      # ECS Service Metrics
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", module.ecs_frontend.service_name, "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", ".", ".", ".", "."],
            ["AWS/ECS", "CPUUtilization", "ServiceName", module.ecs_backend.service_name, "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS CPU and Memory Utilization"
          period  = 300
        }
      },
      # Application Load Balancer Metrics
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix],
            [".", "TargetResponseTime", ".", "."],
            [".", "HTTPCode_Target_2XX_Count", ".", "."],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ALB Request Metrics"
          period  = 300
        }
      },
      # Database Metrics
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBClusterIdentifier", aws_rds_cluster.aurora_postgresql.cluster_identifier],
            [".", "DatabaseConnections", ".", "."],
            [".", "ReadLatency", ".", "."],
            [".", "WriteLatency", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "RDS Aurora Metrics"
          period  = 300
        }
      },
      # ElastiCache Metrics
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ElastiCache", "CPUUtilization", "CacheClusterId", aws_elasticache_replication_group.redis.id],
            [".", "DatabaseMemoryUsagePercentage", ".", "."],
            [".", "CacheHitRate", ".", "."],
            [".", "CurrConnections", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ElastiCache Redis Metrics"
          period  = 300
        }
      }
    ]
  })

  tags = local.common_tags
}

# Cost optimization dashboard
resource "aws_cloudwatch_dashboard" "cost_optimization" {
  dashboard_name = "${local.name_prefix}-cost-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      # Fargate Spot vs On-Demand Usage
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "RunningTaskCount", "ServiceName", module.ecs_frontend.service_name, "ClusterName", aws_ecs_cluster.main.name],
            ["AWS/ECS", "RunningTaskCount", "ServiceName", module.ecs_backend.service_name, "ClusterName", aws_ecs_cluster.main.name],
            ["AWS/ECS", "RunningTaskCount", "ServiceName", module.ecs_workers.service_name, "ClusterName", aws_ecs_cluster.main.name]
          ]
          view    = "timeSeries"
          stacked = true
          region  = var.aws_region
          title   = "ECS Task Count by Service"
          period  = 300
        }
      },
      # S3 Storage and Requests
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/S3", "BucketSizeBytes", "BucketName", aws_s3_bucket.assets.bucket, "StorageType", "StandardStorage"],
            ["AWS/S3", "NumberOfObjects", "BucketName", aws_s3_bucket.assets.bucket, "StorageType", "AllStorageTypes"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "S3 Storage Metrics"
          period  = 86400  # Daily
        }
      }
    ]
  })

  tags = local.common_tags
}

# =============================================================================
# CLOUDWATCH ALARMS
# =============================================================================

# ECS Service High CPU Alarm
resource "aws_cloudwatch_metric_alarm" "ecs_backend_high_cpu" {
  alarm_name          = "${local.name_prefix}-backend-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS backend CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    ServiceName = module.ecs_backend.service_name
    ClusterName = aws_ecs_cluster.main.name
  }

  tags = local.common_tags
}

# ECS Service High Memory Alarm
resource "aws_cloudwatch_metric_alarm" "ecs_backend_high_memory" {
  alarm_name          = "${local.name_prefix}-backend-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "120"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors ECS backend memory utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ServiceName = module.ecs_backend.service_name
    ClusterName = aws_ecs_cluster.main.name
  }

  tags = local.common_tags
}

# ALB High Response Time Alarm
resource "aws_cloudwatch_metric_alarm" "alb_high_response_time" {
  alarm_name          = "${local.name_prefix}-alb-high-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = "1"  # 1 second
  alarm_description   = "This metric monitors ALB response time"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = local.common_tags
}

# ALB 5xx Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${local.name_prefix}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors ALB 5xx errors"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = local.common_tags
}

# RDS CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${local.name_prefix}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.aurora_postgresql.cluster_identifier
  }

  tags = local.common_tags
}

# RDS Database Connection Alarm
resource "aws_cloudwatch_metric_alarm" "rds_high_connections" {
  alarm_name          = "${local.name_prefix}-rds-high-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"  # Adjust based on your max connections
  alarm_description   = "This metric monitors RDS database connections"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.aurora_postgresql.cluster_identifier
  }

  tags = local.common_tags
}

# ElastiCache High CPU Alarm
resource "aws_cloudwatch_metric_alarm" "elasticache_high_cpu" {
  alarm_name          = "${local.name_prefix}-elasticache-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "75"
  alarm_description   = "This metric monitors ElastiCache CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.redis.id
  }

  tags = local.common_tags
}

# ElastiCache Memory Usage Alarm
resource "aws_cloudwatch_metric_alarm" "elasticache_high_memory" {
  alarm_name          = "${local.name_prefix}-elasticache-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors ElastiCache memory usage"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.redis.id
  }

  tags = local.common_tags
}

# =============================================================================
# APPLICATION INSIGHTS
# =============================================================================

# CloudWatch Application Insights for enhanced monitoring
resource "aws_applicationinsights_application" "main" {
  count               = var.environment == "production" ? 1 : 0
  resource_group_name = aws_resourcegroups_group.main[0].name
  auto_config_enabled = true
  cwe_monitor_enabled = true
  
  log_pattern {
    pattern_name = "PostizSSO-LogPattern"
    pattern      = "[timestamp, request_id, level, message]"
    rank         = 1
  }

  tags = local.common_tags
}

# Resource group for Application Insights
resource "aws_resourcegroups_group" "main" {
  count = var.environment == "production" ? 1 : 0
  name  = "${local.name_prefix}-resource-group"

  resource_query {
    query = jsonencode({
      ResourceTypeFilters = [
        "AWS::ECS::Service",
        "AWS::RDS::DBCluster",
        "AWS::ElastiCache::ReplicationGroup",
        "AWS::ElasticLoadBalancingV2::LoadBalancer"
      ]
      TagFilters = [
        {
          Key    = "Project"
          Values = ["Postiz-SSO"]
        },
        {
          Key    = "Environment"
          Values = [var.environment]
        }
      ]
    })
  }

  tags = local.common_tags
}

# =============================================================================
# CUSTOM METRICS AND LOGS
# =============================================================================

# Custom log group for application logs
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/application/${local.name_prefix}"
  retention_in_days = var.log_retention_days
  kms_key_id       = aws_kms_key.logs.arn

  tags = local.common_tags
}

# Custom metric filter for error tracking
resource "aws_cloudwatch_log_metric_filter" "error_count" {
  name           = "${local.name_prefix}-error-count"
  log_group_name = aws_cloudwatch_log_group.ecs.name
  pattern        = "ERROR"

  metric_transformation {
    name      = "${local.name_prefix}-error-count"
    namespace = "Postiz/Application"
    value     = "1"
  }
}

# Custom metric filter for SSO authentication events
resource "aws_cloudwatch_log_metric_filter" "sso_auth_events" {
  name           = "${local.name_prefix}-sso-auth-events"
  log_group_name = aws_cloudwatch_log_group.ecs.name
  pattern        = "[timestamp, request_id, level=\"INFO\", message=\"SSO*\"]"

  metric_transformation {
    name      = "${local.name_prefix}-sso-auth-count"
    namespace = "Postiz/SSO"
    value     = "1"
  }
}

# Alarm for high error rate
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${local.name_prefix}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "${local.name_prefix}-error-count"
  namespace           = "Postiz/Application"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "High application error rate detected"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = local.common_tags
}

# =============================================================================
# LAMBDA FUNCTIONS FOR CUSTOM MONITORING
# =============================================================================

# Lambda function for cost monitoring
resource "aws_lambda_function" "cost_monitor" {
  filename         = "cost-monitor.zip"
  function_name    = "${local.name_prefix}-cost-monitor"
  role            = aws_iam_role.cost_monitor_lambda.arn
  handler         = "index.handler"
  source_code_hash = data.archive_file.cost_monitor.output_base64sha256
  runtime         = "python3.9"
  timeout         = 60

  environment {
    variables = {
      SNS_TOPIC_ARN     = aws_sns_topic.alerts.arn
      BUDGET_LIMIT      = var.monthly_budget_limit
      PROJECT_TAG       = "Postiz-SSO"
      ENVIRONMENT       = var.environment
    }
  }

  tags = local.common_tags
}

# Create cost monitoring Lambda code
data "archive_file" "cost_monitor" {
  type        = "zip"
  output_path = "cost-monitor.zip"
  source {
    content = <<EOF
import json
import boto3
import os
from datetime import datetime, timedelta

def handler(event, context):
    """Monitor AWS costs and send alerts"""
    
    ce = boto3.client('ce')
    sns = boto3.client('sns')
    
    # Get cost and usage for the current month
    now = datetime.utcnow()
    start_date = now.replace(day=1).strftime('%Y-%m-%d')
    end_date = now.strftime('%Y-%m-%d')
    
    try:
        response = ce.get_cost_and_usage(
            TimePeriod={
                'Start': start_date,
                'End': end_date
            },
            Granularity='MONTHLY',
            Metrics=['BlendedCost'],
            GroupBy=[
                {
                    'Type': 'TAG',
                    'Key': 'Project'
                }
            ],
            Filter={
                'Tags': {
                    'Key': 'Project',
                    'Values': [os.environ['PROJECT_TAG']]
                }
            }
        )
        
        total_cost = 0
        for result in response['ResultsByTime']:
            for group in result['Groups']:
                total_cost += float(group['Metrics']['BlendedCost']['Amount'])
        
        budget_limit = float(os.environ['BUDGET_LIMIT'])
        usage_percentage = (total_cost / budget_limit) * 100
        
        # Send alert if over 80% of budget
        if usage_percentage > 80:
            message = f"""
            Cost Alert for {os.environ['PROJECT_TAG']} - {os.environ['ENVIRONMENT']}
            
            Current Monthly Cost: ${total_cost:.2f}
            Budget Limit: ${budget_limit:.2f}
            Usage: {usage_percentage:.1f}%
            
            Time: {datetime.utcnow().isoformat()}
            """
            
            sns.publish(
                TopicArn=os.environ['SNS_TOPIC_ARN'],
                Message=message,
                Subject=f"Cost Alert: {usage_percentage:.1f}% of budget used"
            )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'total_cost': total_cost,
                'budget_limit': budget_limit,
                'usage_percentage': usage_percentage
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
EOF
    filename = "index.py"
  }
}

# IAM role for cost monitoring Lambda
resource "aws_iam_role" "cost_monitor_lambda" {
  name = "${local.name_prefix}-cost-monitor-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# IAM policy for cost monitoring Lambda
resource "aws_iam_role_policy" "cost_monitor_lambda" {
  name = "${local.name_prefix}-cost-monitor-lambda-policy"
  role = aws_iam_role.cost_monitor_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ce:GetCostAndUsage",
          "ce:GetUsageReport",
          "budgets:ViewBudget"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.alerts.arn
      }
    ]
  })
}

# CloudWatch Event Rule to trigger cost monitoring daily
resource "aws_cloudwatch_event_rule" "cost_monitor_schedule" {
  name                = "${local.name_prefix}-cost-monitor-schedule"
  description         = "Trigger cost monitoring Lambda daily"
  schedule_expression = "rate(1 day)"

  tags = local.common_tags
}

# CloudWatch Event Target
resource "aws_cloudwatch_event_target" "cost_monitor_target" {
  rule      = aws_cloudwatch_event_rule.cost_monitor_schedule.name
  target_id = "CostMonitorLambdaTarget"
  arn       = aws_lambda_function.cost_monitor.arn
}

# Permission for CloudWatch Events to invoke Lambda
resource "aws_lambda_permission" "allow_cloudwatch_cost_monitor" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cost_monitor.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.cost_monitor_schedule.arn
}

# =============================================================================
# X-RAY TRACING
# =============================================================================

# X-Ray sampling rule for distributed tracing
resource "aws_xray_sampling_rule" "main" {
  count           = var.environment == "production" ? 1 : 0
  rule_name       = "${local.name_prefix}-sampling-rule"
  priority        = 9000
  version         = 1
  reservoir_size  = 1
  fixed_rate      = 0.1  # 10% sampling rate
  url_path        = "*"
  host            = "*"
  http_method     = "*"
  service_type    = "*"
  service_name    = "*"
  resource_arn    = "*"

  tags = local.common_tags
}