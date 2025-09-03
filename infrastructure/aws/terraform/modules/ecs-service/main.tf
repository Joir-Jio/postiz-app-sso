# ECS Service Module for Postiz SSO
# Reusable module for creating ECS services with auto-scaling

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# =============================================================================
# ECS SERVICE
# =============================================================================

resource "aws_ecs_service" "main" {
  name            = var.name
  cluster         = var.cluster_id
  task_definition = var.task_definition
  desired_count   = var.desired_count
  launch_type     = var.launch_type

  # Deployment configuration
  deployment_configuration {
    maximum_percent         = var.deployment_maximum_percent
    minimum_healthy_percent = var.deployment_minimum_healthy_percent
    
    deployment_circuit_breaker {
      enable   = true
      rollback = true
    }
  }

  # Network configuration for awsvpc mode
  dynamic "network_configuration" {
    for_each = var.network_configuration != null ? [var.network_configuration] : []
    content {
      security_groups  = network_configuration.value.security_groups
      subnets         = network_configuration.value.subnets
      assign_public_ip = lookup(network_configuration.value, "assign_public_ip", false)
    }
  }

  # Load balancer configuration
  dynamic "load_balancer" {
    for_each = var.load_balancer != null ? [var.load_balancer] : []
    content {
      target_group_arn = load_balancer.value.target_group_arn
      container_name   = load_balancer.value.container_name
      container_port   = load_balancer.value.container_port
    }
  }

  # Capacity provider strategy for cost optimization
  dynamic "capacity_provider_strategy" {
    for_each = var.capacity_provider_strategy != null ? var.capacity_provider_strategy : []
    content {
      capacity_provider = capacity_provider_strategy.value.capacity_provider
      weight           = capacity_provider_strategy.value.weight
      base             = lookup(capacity_provider_strategy.value, "base", 0)
    }
  }

  # Service Connect configuration (optional)
  dynamic "service_connect_configuration" {
    for_each = var.service_connect_enabled ? [1] : []
    content {
      enabled = true
      namespace = var.service_connect_namespace
      
      dynamic "service" {
        for_each = var.service_connect_services
        content {
          port_name      = service.value.port_name
          discovery_name = service.value.discovery_name
          client_alias {
            port     = service.value.client_port
            dns_name = service.value.dns_name
          }
        }
      }
    }
  }

  # Ignore changes to desired_count when auto-scaling is enabled
  lifecycle {
    ignore_changes = var.enable_autoscaling ? [desired_count] : []
  }

  # Wait for steady state on deployment
  wait_for_steady_state = var.wait_for_steady_state

  tags = var.tags
}

# =============================================================================
# AUTO SCALING
# =============================================================================

# Auto Scaling Target
resource "aws_appautoscaling_target" "main" {
  count              = var.enable_autoscaling ? 1 : 0
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${split("/", var.cluster_id)[1]}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"

  tags = var.tags
}

# CPU-based Auto Scaling Policy
resource "aws_appautoscaling_policy" "cpu_scaling" {
  count              = var.enable_autoscaling && var.cpu_scaling_enabled ? 1 : 0
  name               = "${var.name}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main[0].resource_id
  scalable_dimension = aws_appautoscaling_target.main[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.main[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = var.cpu_target_value
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}

# Memory-based Auto Scaling Policy
resource "aws_appautoscaling_policy" "memory_scaling" {
  count              = var.enable_autoscaling && var.memory_scaling_enabled ? 1 : 0
  name               = "${var.name}-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main[0].resource_id
  scalable_dimension = aws_appautoscaling_target.main[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.main[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = var.memory_target_value
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}

# Custom metric scaling (e.g., for queue depth)
resource "aws_appautoscaling_policy" "custom_metric_scaling" {
  count              = var.enable_autoscaling && var.custom_metric_scaling != null ? 1 : 0
  name               = "${var.name}-custom-metric-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.main[0].resource_id
  scalable_dimension = aws_appautoscaling_target.main[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.main[0].service_namespace

  target_tracking_scaling_policy_configuration {
    customized_metric_specification {
      metric_name = var.custom_metric_scaling.metric_name
      namespace   = var.custom_metric_scaling.namespace
      statistic   = var.custom_metric_scaling.statistic
      
      dynamic "dimensions" {
        for_each = var.custom_metric_scaling.dimensions != null ? var.custom_metric_scaling.dimensions : {}
        content {
          name  = dimensions.key
          value = dimensions.value
        }
      }
    }
    target_value       = var.custom_metric_scaling.target_value
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}

# =============================================================================
# CLOUDWATCH ALARMS FOR SERVICE MONITORING
# =============================================================================

# Service CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "service_cpu_high" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "${var.name}-cpu-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.cpu_alarm_threshold
  alarm_description   = "This metric monitors ECS service CPU utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.main.name
    ClusterName = split("/", var.cluster_id)[1]
  }

  tags = var.tags
}

# Service Memory Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "service_memory_high" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "${var.name}-memory-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.memory_alarm_threshold
  alarm_description   = "This metric monitors ECS service memory utilization"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.main.name
    ClusterName = split("/", var.cluster_id)[1]
  }

  tags = var.tags
}

# Service Running Task Count Alarm (for detecting service failures)
resource "aws_cloudwatch_metric_alarm" "service_tasks_low" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "${var.name}-running-tasks-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "RunningTaskCount"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = var.min_capacity
  alarm_description   = "This metric monitors ECS service running task count"
  alarm_actions       = var.alarm_actions
  treat_missing_data  = "breaching"

  dimensions = {
    ServiceName = aws_ecs_service.main.name
    ClusterName = split("/", var.cluster_id)[1]
  }

  tags = var.tags
}