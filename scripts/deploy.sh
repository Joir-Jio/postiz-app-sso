#!/bin/bash
# Quick deployment script for Postiz SSO
# Usage: ./scripts/deploy.sh [environment] [version]

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-prod}
VERSION=${2:-latest}
PROJECT_NAME="postiz-sso"
REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION:-us-east-1}.amazonaws.com

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local deps=("docker" "aws" "terraform" "jq")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            log_error "Required dependency '$dep' is not installed"
            exit 1
        fi
    done
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_error "AWS credentials not configured"
        exit 1
    fi
    
    # Check Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Deploy infrastructure
deploy_infrastructure() {
    log_info "Deploying infrastructure with Terraform..."
    
    cd terraform
    
    # Initialize Terraform if needed
    if [ ! -d ".terraform" ]; then
        terraform init
    fi
    
    # Plan and apply
    terraform plan -var="environment=$ENVIRONMENT"
    terraform apply -auto-approve -var="environment=$ENVIRONMENT"
    
    cd ..
    log_success "Infrastructure deployed successfully"
}

# Build and push Docker images
build_and_push_images() {
    log_info "Building and pushing Docker images..."
    
    # Login to ECR
    aws ecr get-login-password --region ${AWS_DEFAULT_REGION:-us-east-1} | \
        docker login --username AWS --password-stdin $REGISTRY
    
    # Build and push using our build script
    ./scripts/docker-build.sh -v $VERSION -r $REGISTRY -p -c
    
    log_success "Docker images built and pushed successfully"
}

# Update ECS services
update_ecs_services() {
    log_info "Updating ECS services..."
    
    local cluster_name="${PROJECT_NAME}"
    local services=("frontend" "backend" "workers" "cron")
    
    # Update task definition with new image tags
    local task_def_file="aws/ecs-task-definition.json"
    local temp_file=$(mktemp)
    
    # Replace placeholder values
    sed "s|YOUR_REGISTRY|$REGISTRY|g; s|latest|$VERSION|g" $task_def_file > $temp_file
    
    # Register new task definition
    local task_def_arn=$(aws ecs register-task-definition \
        --cli-input-json file://$temp_file \
        --query 'taskDefinition.taskDefinitionArn' \
        --output text)
    
    log_info "Registered new task definition: $task_def_arn"
    
    # Update services
    for service in "${services[@]}"; do
        log_info "Updating service: $service"
        
        aws ecs update-service \
            --cluster $cluster_name \
            --service "${PROJECT_NAME}-${service}" \
            --task-definition $task_def_arn \
            --force-new-deployment >/dev/null
        
        log_success "Service $service updated"
    done
    
    rm -f $temp_file
    log_success "All ECS services updated successfully"
}

# Wait for deployment to complete
wait_for_deployment() {
    log_info "Waiting for deployment to complete..."
    
    local cluster_name="${PROJECT_NAME}"
    local services=("frontend" "backend" "workers" "cron")
    local max_wait=600 # 10 minutes
    local wait_time=0
    
    for service in "${services[@]}"; do
        log_info "Waiting for service ${service} to stabilize..."
        
        while [ $wait_time -lt $max_wait ]; do
            local deployment_status=$(aws ecs describe-services \
                --cluster $cluster_name \
                --services "${PROJECT_NAME}-${service}" \
                --query 'services[0].deployments[0].status' \
                --output text)
            
            if [ "$deployment_status" = "PRIMARY" ]; then
                log_success "Service ${service} deployment completed"
                break
            fi
            
            log_info "Service ${service} deployment in progress... (${wait_time}s)"
            sleep 30
            wait_time=$((wait_time + 30))
        done
        
        if [ $wait_time -ge $max_wait ]; then
            log_error "Service ${service} deployment timed out"
            exit 1
        fi
    done
    
    log_success "All services deployed successfully"
}

# Run health checks
run_health_checks() {
    log_info "Running post-deployment health checks..."
    
    # Get ALB DNS name
    local alb_dns=$(cd terraform && terraform output -raw load_balancer_dns_name)
    
    # Check frontend health
    log_info "Checking frontend health..."
    local frontend_health=$(curl -s -o /dev/null -w "%{http_code}" "https://${alb_dns}/api/health" || echo "000")
    
    if [ "$frontend_health" = "200" ]; then
        log_success "Frontend health check passed"
    else
        log_warning "Frontend health check failed (HTTP $frontend_health)"
    fi
    
    # Check backend health
    log_info "Checking backend health..."
    local backend_health=$(curl -s -o /dev/null -w "%{http_code}" "https://api.${alb_dns}/health" || echo "000")
    
    if [ "$backend_health" = "200" ]; then
        log_success "Backend health check passed"
    else
        log_warning "Backend health check failed (HTTP $backend_health)"
    fi
    
    log_success "Health checks completed"
}

# Show deployment summary
show_deployment_summary() {
    log_info "Deployment Summary:"
    echo "=================="
    echo "Environment: $ENVIRONMENT"
    echo "Version: $VERSION"
    echo "Project: $PROJECT_NAME"
    echo ""
    
    # Get infrastructure outputs
    cd terraform
    echo "Infrastructure:"
    echo "  VPC ID: $(terraform output -raw vpc_id)"
    echo "  ALB DNS: $(terraform output -raw load_balancer_dns_name)"
    echo "  ECS Cluster: $(terraform output -raw ecs_cluster_name)"
    echo ""
    
    echo "Services:"
    local cluster_name="${PROJECT_NAME}"
    local services=("frontend" "backend" "workers" "cron")
    
    for service in "${services[@]}"; do
        local service_info=$(aws ecs describe-services \
            --cluster $cluster_name \
            --services "${PROJECT_NAME}-${service}" \
            --query 'services[0].{Running:runningCount,Desired:desiredCount,Status:status}' \
            --output text 2>/dev/null || echo "N/A N/A N/A")
        
        echo "  ${service}: $service_info"
    done
    
    cd ..
    
    echo ""
    log_success "Deployment completed successfully!"
    echo ""
    echo "Access your application at:"
    echo "  Frontend: https://$(cd terraform && terraform output -raw load_balancer_dns_name)"
    echo "  Backend API: https://api.$(cd terraform && terraform output -raw load_balancer_dns_name)"
}

# Rollback function
rollback_deployment() {
    log_warning "Rolling back deployment..."
    
    local cluster_name="${PROJECT_NAME}"
    local services=("frontend" "backend" "workers" "cron")
    
    # Get previous task definition
    local prev_task_def=$(aws ecs list-task-definitions \
        --family-prefix "${PROJECT_NAME}" \
        --status ACTIVE \
        --sort DESC \
        --max-items 2 \
        --query 'taskDefinitionArns[1]' \
        --output text)
    
    if [ "$prev_task_def" != "None" ]; then
        log_info "Rolling back to: $prev_task_def"
        
        for service in "${services[@]}"; do
            aws ecs update-service \
                --cluster $cluster_name \
                --service "${PROJECT_NAME}-${service}" \
                --task-definition $prev_task_def \
                --force-new-deployment >/dev/null
            
            log_info "Rolled back service: $service"
        done
        
        log_success "Rollback completed"
    else
        log_error "No previous task definition found for rollback"
        exit 1
    fi
}

# Error handler
handle_error() {
    log_error "Deployment failed at step: $1"
    echo ""
    echo "Options:"
    echo "1. Check logs: aws logs tail /ecs/${PROJECT_NAME}-backend --follow"
    echo "2. Rollback: $0 rollback"
    echo "3. Check service status: aws ecs describe-services --cluster ${PROJECT_NAME} --services ${PROJECT_NAME}-backend"
    exit 1
}

# Main deployment flow
main() {
    echo "========================================"
    echo "Postiz SSO Deployment Script"
    echo "========================================"
    echo ""
    
    # Handle special commands
    case "${1:-deploy}" in
        "rollback")
            rollback_deployment
            exit 0
            ;;
        "health")
            run_health_checks
            exit 0
            ;;
        "status")
            show_deployment_summary
            exit 0
            ;;
    esac
    
    # Set error handler
    trap 'handle_error "Unknown"' ERR
    
    # Run deployment steps
    check_prerequisites || handle_error "Prerequisites check"
    deploy_infrastructure || handle_error "Infrastructure deployment"
    build_and_push_images || handle_error "Image build and push"
    update_ecs_services || handle_error "ECS service update"
    wait_for_deployment || handle_error "Deployment wait"
    run_health_checks || handle_error "Health checks"
    show_deployment_summary
}

# Show help
show_help() {
    cat << EOF
Postiz SSO Deployment Script

Usage: $0 [COMMAND] [ENVIRONMENT] [VERSION]

Commands:
    deploy      Deploy application (default)
    rollback    Rollback to previous version
    health      Run health checks only
    status      Show deployment status
    help        Show this help

Arguments:
    ENVIRONMENT    Target environment (prod, staging) [default: prod]
    VERSION        Application version [default: latest]

Environment Variables:
    AWS_ACCOUNT_ID        AWS account ID (required)
    AWS_DEFAULT_REGION    AWS region [default: us-east-1]

Examples:
    $0                           # Deploy latest to prod
    $0 deploy staging v1.2.3     # Deploy version 1.2.3 to staging  
    $0 rollback                  # Rollback current deployment
    $0 health                    # Run health checks
    $0 status                    # Show current status

EOF
}

# Handle help
if [ "${1:-}" = "help" ] || [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
    show_help
    exit 0
fi

# Check required environment variables
if [ -z "${AWS_ACCOUNT_ID:-}" ]; then
    log_error "AWS_ACCOUNT_ID environment variable is required"
    echo "Example: export AWS_ACCOUNT_ID=123456789012"
    exit 1
fi

# Run main function
main "$@"