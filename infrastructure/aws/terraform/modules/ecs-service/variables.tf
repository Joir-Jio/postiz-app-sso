# ECS Service Module Variables

# =============================================================================
# REQUIRED VARIABLES
# =============================================================================

variable "name" {
  description = "Name of the ECS service"
  type        = string
}

variable "cluster_id" {
  description = "ECS cluster ID or ARN"
  type        = string
}

variable "task_definition" {
  description = "ECS task definition ARN"
  type        = string
}

# =============================================================================
# SERVICE CONFIGURATION
# =============================================================================

variable "desired_count" {
  description = "Desired number of tasks to run"
  type        = number
  default     = 1
}

variable "launch_type" {
  description = "ECS launch type (FARGATE or EC2)"
  type        = string
  default     = "FARGATE"
  
  validation {
    condition = contains(["FARGATE", "EC2"], var.launch_type)
    error_message = "Launch type must be FARGATE or EC2."
  }
}

variable "network_configuration" {
  description = "Network configuration for awsvpc network mode"
  type = object({
    security_groups  = list(string)
    subnets         = list(string)
    assign_public_ip = optional(bool, false)
  })
  default = null
}

variable "load_balancer" {
  description = "Load balancer configuration"
  type = object({
    target_group_arn = string
    container_name   = string
    container_port   = number
  })
  default = null
}

variable "capacity_provider_strategy" {
  description = "Capacity provider strategy for cost optimization"
  type = list(object({
    capacity_provider = string
    weight           = number
    base             = optional(number, 0)
  }))
  default = null
}

# =============================================================================
# DEPLOYMENT CONFIGURATION
# =============================================================================

variable "deployment_maximum_percent" {
  description = "Upper limit on the number of tasks that can run during deployment"
  type        = number
  default     = 200
}

variable "deployment_minimum_healthy_percent" {
  description = "Lower limit on the number of tasks that must remain healthy during deployment"
  type        = number
  default     = 100
}

variable "wait_for_steady_state" {
  description = "Wait for service to reach steady state after deployment"
  type        = bool
  default     = true
}

# =============================================================================
# AUTO SCALING CONFIGURATION
# =============================================================================

variable "enable_autoscaling" {
  description = "Enable auto scaling for the service"
  type        = bool
  default     = false
}

variable "min_capacity" {
  description = "Minimum number of tasks when auto scaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks when auto scaling"
  type        = number
  default     = 10
}

# CPU Scaling
variable "cpu_scaling_enabled" {
  description = "Enable CPU-based auto scaling"
  type        = bool
  default     = true
}

variable "cpu_target_value" {
  description = "Target CPU utilization percentage for scaling"
  type        = number
  default     = 70
  
  validation {
    condition = var.cpu_target_value > 0 && var.cpu_target_value <= 100
    error_message = "CPU target value must be between 1 and 100."
  }
}

# Memory Scaling
variable "memory_scaling_enabled" {
  description = "Enable memory-based auto scaling"
  type        = bool
  default     = false
}

variable "memory_target_value" {
  description = "Target memory utilization percentage for scaling"
  type        = number
  default     = 80
  
  validation {
    condition = var.memory_target_value > 0 && var.memory_target_value <= 100
    error_message = "Memory target value must be between 1 and 100."
  }
}

# Custom Metric Scaling
variable "custom_metric_scaling" {
  description = "Custom metric scaling configuration (e.g., for queue depth)"
  type = object({
    metric_name  = string
    namespace    = string
    statistic    = string
    target_value = number
    dimensions   = optional(map(string), {})
  })
  default = null
}

# Scaling Cooldowns
variable "scale_in_cooldown" {
  description = "Time between scale in actions (seconds)"
  type        = number
  default     = 300
}

variable "scale_out_cooldown" {
  description = "Time between scale out actions (seconds)"
  type        = number
  default     = 60
}

# =============================================================================
# SERVICE CONNECT CONFIGURATION
# =============================================================================

variable "service_connect_enabled" {
  description = "Enable ECS Service Connect"
  type        = bool
  default     = false
}

variable "service_connect_namespace" {
  description = "Service Connect namespace ARN"
  type        = string
  default     = ""
}

variable "service_connect_services" {
  description = "Service Connect service configuration"
  type = list(object({
    port_name   = string
    discovery_name = string
    client_port = number
    dns_name    = string
  }))
  default = []
}

# =============================================================================
# MONITORING CONFIGURATION
# =============================================================================

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alarms"
  type        = bool
  default     = true
}

variable "cpu_alarm_threshold" {
  description = "CPU utilization threshold for alarms"
  type        = number
  default     = 80
}

variable "memory_alarm_threshold" {
  description = "Memory utilization threshold for alarms"
  type        = number
  default     = 85
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarm triggers"
  type        = list(string)
  default     = []
}

# =============================================================================
# TAGS
# =============================================================================

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}