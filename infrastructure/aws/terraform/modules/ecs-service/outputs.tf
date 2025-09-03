# ECS Service Module Outputs

# =============================================================================
# SERVICE OUTPUTS
# =============================================================================

output "service_id" {
  description = "ECS service ID"
  value       = aws_ecs_service.main.id
}

output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.main.name
}

output "service_arn" {
  description = "ECS service ARN"
  value       = aws_ecs_service.main.arn
}

output "service_cluster" {
  description = "ECS cluster name"
  value       = aws_ecs_service.main.cluster
}

output "service_desired_count" {
  description = "Desired number of tasks"
  value       = aws_ecs_service.main.desired_count
}

output "service_running_count" {
  description = "Current number of running tasks"
  value       = aws_ecs_service.main.running_count
}

output "service_pending_count" {
  description = "Current number of pending tasks"
  value       = aws_ecs_service.main.pending_count
}

output "service_task_definition" {
  description = "Task definition ARN used by the service"
  value       = aws_ecs_service.main.task_definition
}

# =============================================================================
# AUTO SCALING OUTPUTS
# =============================================================================

output "autoscaling_target_arn" {
  description = "Auto scaling target ARN"
  value       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].arn : null
}

output "autoscaling_target_resource_id" {
  description = "Auto scaling target resource ID"
  value       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].resource_id : null
}

output "autoscaling_min_capacity" {
  description = "Auto scaling minimum capacity"
  value       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].min_capacity : null
}

output "autoscaling_max_capacity" {
  description = "Auto scaling maximum capacity"
  value       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].max_capacity : null
}

output "cpu_scaling_policy_arn" {
  description = "CPU-based auto scaling policy ARN"
  value       = var.enable_autoscaling && var.cpu_scaling_enabled ? aws_appautoscaling_policy.cpu_scaling[0].arn : null
}

output "memory_scaling_policy_arn" {
  description = "Memory-based auto scaling policy ARN"
  value       = var.enable_autoscaling && var.memory_scaling_enabled ? aws_appautoscaling_policy.memory_scaling[0].arn : null
}

output "custom_scaling_policy_arn" {
  description = "Custom metric-based auto scaling policy ARN"
  value       = var.enable_autoscaling && var.custom_metric_scaling != null ? aws_appautoscaling_policy.custom_metric_scaling[0].arn : null
}

# =============================================================================
# MONITORING OUTPUTS
# =============================================================================

output "cpu_alarm_arn" {
  description = "CPU utilization alarm ARN"
  value       = var.enable_monitoring ? aws_cloudwatch_metric_alarm.service_cpu_high[0].arn : null
}

output "memory_alarm_arn" {
  description = "Memory utilization alarm ARN"
  value       = var.enable_monitoring ? aws_cloudwatch_metric_alarm.service_memory_high[0].arn : null
}

output "running_tasks_alarm_arn" {
  description = "Running tasks count alarm ARN"
  value       = var.enable_monitoring ? aws_cloudwatch_metric_alarm.service_tasks_low[0].arn : null
}

# =============================================================================
# SERVICE CONFIGURATION OUTPUTS
# =============================================================================

output "service_configuration" {
  description = "Service configuration summary"
  value = {
    name                = aws_ecs_service.main.name
    cluster            = aws_ecs_service.main.cluster
    launch_type        = aws_ecs_service.main.launch_type
    desired_count      = aws_ecs_service.main.desired_count
    autoscaling_enabled = var.enable_autoscaling
    min_capacity       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].min_capacity : var.desired_count
    max_capacity       = var.enable_autoscaling ? aws_appautoscaling_target.main[0].max_capacity : var.desired_count
    cpu_target         = var.cpu_target_value
    memory_target      = var.memory_target_value
  }
}

# =============================================================================
# LOAD BALANCER OUTPUTS
# =============================================================================

output "load_balancer_config" {
  description = "Load balancer configuration"
  value       = var.load_balancer
  sensitive   = false
}

# =============================================================================
# NETWORKING OUTPUTS
# =============================================================================

output "network_configuration" {
  description = "Network configuration summary"
  value = var.network_configuration != null ? {
    security_groups  = var.network_configuration.security_groups
    subnets         = var.network_configuration.subnets
    assign_public_ip = var.network_configuration.assign_public_ip
  } : null
}

# =============================================================================
# SERVICE METRICS FOR MONITORING
# =============================================================================

output "service_metrics" {
  description = "CloudWatch metrics for monitoring"
  value = {
    cpu_utilization = {
      namespace   = "AWS/ECS"
      metric_name = "CPUUtilization"
      dimensions = {
        ServiceName = aws_ecs_service.main.name
        ClusterName = split("/", var.cluster_id)[1]
      }
    }
    memory_utilization = {
      namespace   = "AWS/ECS"
      metric_name = "MemoryUtilization"
      dimensions = {
        ServiceName = aws_ecs_service.main.name
        ClusterName = split("/", var.cluster_id)[1]
      }
    }
    running_task_count = {
      namespace   = "AWS/ECS"
      metric_name = "RunningTaskCount"
      dimensions = {
        ServiceName = aws_ecs_service.main.name
        ClusterName = split("/", var.cluster_id)[1]
      }
    }
  }
}