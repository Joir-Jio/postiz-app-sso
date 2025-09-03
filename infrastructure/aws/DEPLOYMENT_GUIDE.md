# Postiz SSO AWS Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- ✅ AWS CLI configured with appropriate permissions
- ✅ Terraform >= 1.5 installed
- ✅ Docker installed for building images
- ✅ Domain name registered (for SSL certificates)
- ✅ Social media API keys obtained
- ✅ GCS service account (if using mixed cloud strategy)

## Quick Start Deployment

### Step 1: Clone and Setup

```bash
git clone <your-repo>
cd postiz-app-sso/infrastructure/aws/terraform
```

### Step 2: Configure Variables

```bash
# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit configuration with your values
nano terraform.tfvars
```

**Critical variables to update:**
```hcl
domain_name = "postiz.yourdomain.com"
alert_email = "admin@yourdomain.com"
jwt_secret = "your-32-character-secret-here"
encryption_key = "your-32-character-encryption-key"

# Social media API keys
twitter_client_id = "your-twitter-client-id"
facebook_client_id = "your-facebook-app-id"
# ... other API keys
```

### Step 3: Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan deployment (review changes)
terraform plan

# Deploy infrastructure
terraform apply
```

### Step 4: Update DNS

After deployment, update your domain's DNS records:

```bash
# Get the load balancer DNS name from Terraform output
ALB_DNS=$(terraform output -raw load_balancer_dns_name)

# Update your DNS provider with CNAME records:
# postiz.yourdomain.com -> $ALB_DNS
# api.postiz.yourdomain.com -> $ALB_DNS
```

### Step 5: Build and Deploy Applications

```bash
# Get ECR repository URLs
terraform output ecs_repository_urls

# Build and push images (see detailed instructions below)
./scripts/build-and-push.sh
```

## Detailed Deployment Instructions

### Environment Setup

#### 1. AWS Permissions Required

Your AWS user/role needs these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:*", "ecs:*", "rds:*", "elasticache:*",
                "s3:*", "cloudfront:*", "route53:*", "acm:*",
                "iam:*", "kms:*", "secretsmanager:*",
                "logs:*", "sns:*", "cloudwatch:*", "wafv2:*"
            ],
            "Resource": "*"
        }
    ]
}
```

#### 2. Generate Secrets

```bash
# Generate JWT secret
openssl rand -hex 32

# Generate encryption key
openssl rand -hex 32

# Generate Redis password
openssl rand -base64 32
```

### Infrastructure Deployment

#### 1. Terraform State Management

For production, use remote state:

```hcl
# Add to main.tf
terraform {
  backend "s3" {
    bucket  = "your-terraform-state-bucket"
    key     = "postiz-sso/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
```

#### 2. Environment-Specific Deployments

Create separate `.tfvars` files for each environment:

```bash
# Development
terraform apply -var-file="dev.tfvars"

# Staging  
terraform apply -var-file="staging.tfvars"

# Production
terraform apply -var-file="production.tfvars"
```

#### 3. Verify Infrastructure

```bash
# Check ECS cluster
aws ecs list-clusters

# Check Aurora cluster
aws rds describe-db-clusters

# Check Redis cluster
aws elasticache describe-replication-groups

# Check load balancer
aws elbv2 describe-load-balancers
```

### Application Deployment

#### 1. ECR Repository Setup

```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Create repositories (if not created by Terraform)
aws ecr create-repository --repository-name postiz-frontend
aws ecr create-repository --repository-name postiz-backend
aws ecr create-repository --repository-name postiz-workers
aws ecr create-repository --repository-name postiz-cron
```

#### 2. Build Application Images

```bash
#!/bin/bash
# build-and-push.sh

REGION="us-east-1"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGISTRY="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"

# Build images
docker build -f Dockerfile --target frontend -t postiz-frontend .
docker build -f Dockerfile --target backend -t postiz-backend .
docker build -f Dockerfile --target workers -t postiz-workers .
docker build -f Dockerfile --target cron -t postiz-cron .

# Tag images
docker tag postiz-frontend:latest ${REGISTRY}/postiz-frontend:latest
docker tag postiz-backend:latest ${REGISTRY}/postiz-backend:latest
docker tag postiz-workers:latest ${REGISTRY}/postiz-workers:latest
docker tag postiz-cron:latest ${REGISTRY}/postiz-cron:latest

# Push images
docker push ${REGISTRY}/postiz-frontend:latest
docker push ${REGISTRY}/postiz-backend:latest
docker push ${REGISTRY}/postiz-workers:latest
docker push ${REGISTRY}/postiz-cron:latest
```

#### 3. Deploy ECS Services

```bash
# Update services to use new images
aws ecs update-service \
  --cluster postiz-production-cluster \
  --service postiz-production-frontend \
  --force-new-deployment

aws ecs update-service \
  --cluster postiz-production-cluster \
  --service postiz-production-backend \
  --force-new-deployment

# Monitor deployment
aws ecs wait services-stable \
  --cluster postiz-production-cluster \
  --services postiz-production-frontend postiz-production-backend
```

### Database Setup

#### 1. Database Migration

```bash
# Get database endpoint from Terraform output
DB_ENDPOINT=$(terraform output -raw aurora_cluster_endpoint)

# Get database password from Secrets Manager
DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id postiz-production-aurora-secret \
  --query SecretString --output text | jq -r .password)

# Run migrations
DATABASE_URL="postgresql://postiz_admin:${DB_PASSWORD}@${DB_ENDPOINT}:5432/postiz" \
npm run prisma-db-push
```

#### 2. Initial Data Setup

```bash
# Create admin user
DATABASE_URL="postgresql://postiz_admin:${DB_PASSWORD}@${DB_ENDPOINT}:5432/postiz" \
node scripts/create-admin-user.js
```

### SSL Certificate Setup

#### 1. Certificate Validation

```bash
# Get certificate ARN
CERT_ARN=$(terraform output -raw acm_certificate_arn)

# Check certificate status
aws acm describe-certificate --certificate-arn $CERT_ARN

# Validate via DNS (if using Route 53)
aws acm list-certificates --certificate-statuses PENDING_VALIDATION
```

#### 2. DNS Configuration

If using Route 53:
```bash
# Create hosted zone
aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)

# Update nameservers at your domain registrar
aws route53 get-hosted-zone --id /hostedzone/Z123456789
```

### Monitoring Setup

#### 1. CloudWatch Dashboard

```bash
# Import custom dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "Postiz-Production" \
  --dashboard-body file://dashboard.json
```

#### 2. Set Up Alerts

```bash
# Test SNS topic
aws sns publish \
  --topic-arn $(terraform output -raw sns_topic_arn) \
  --message "Test alert from Postiz deployment"
```

## Security Hardening

### 1. Update Default Passwords

```bash
# Rotate all secrets after deployment
aws secretsmanager update-secret \
  --secret-id postiz-production-app-secrets \
  --secret-string '{"JWT_SECRET":"new-jwt-secret","ENCRYPTION_KEY":"new-encryption-key"}'
```

### 2. Enable GuardDuty

```bash
# Enable GuardDuty
aws guardduty create-detector \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES
```

### 3. Configure WAF Rules

The WAF is automatically configured, but you can customize rules:
```bash
# List WAF rules
aws wafv2 get-web-acl \
  --scope REGIONAL \
  --id $(terraform output -raw waf_web_acl_id)
```

## Performance Optimization

### 1. Auto-Scaling Configuration

```bash
# Check auto-scaling policies
aws application-autoscaling describe-scaling-policies \
  --service-namespace ecs
```

### 2. Database Performance

```bash
# Enable Performance Insights
aws rds modify-db-cluster \
  --db-cluster-identifier postiz-production-aurora-cluster \
  --enable-performance-insights
```

## Cost Optimization

### 1. Enable Cost Allocation Tags

```bash
# Activate cost allocation tags
aws ce put-cost-categories \
  --name "Postiz-SSO" \
  --rules file://cost-categories.json
```

### 2. Set Up Budgets

```bash
# Create monthly budget
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://monthly-budget.json
```

## Troubleshooting

### Common Issues

#### 1. ECS Task Failed to Start

```bash
# Check task definition
aws ecs describe-task-definition --task-definition postiz-production-backend

# Check service events
aws ecs describe-services \
  --cluster postiz-production-cluster \
  --services postiz-production-backend
```

#### 2. Database Connection Issues

```bash
# Test database connectivity
aws rds describe-db-cluster-endpoints \
  --db-cluster-identifier postiz-production-aurora-cluster

# Check security groups
aws ec2 describe-security-groups \
  --group-names postiz-production-aurora-sg
```

#### 3. Load Balancer Health Check Failures

```bash
# Check target health
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw target_group_arns.backend)

# Check ECS service status
aws ecs describe-services \
  --cluster postiz-production-cluster \
  --services postiz-production-backend
```

### Monitoring and Logs

#### 1. CloudWatch Logs

```bash
# View application logs
aws logs tail /aws/ecs/postiz-production --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/ecs/postiz-production \
  --filter-pattern "ERROR"
```

#### 2. ECS Exec for Debugging

```bash
# Enable ECS exec on running tasks
aws ecs execute-command \
  --cluster postiz-production-cluster \
  --task <task-id> \
  --container backend \
  --interactive \
  --command "/bin/bash"
```

## Maintenance

### Regular Tasks

#### 1. Update ECS Services

```bash
#!/bin/bash
# update-services.sh

CLUSTER="postiz-production-cluster"
SERVICES=("frontend" "backend" "workers")

for service in "${SERVICES[@]}"; do
  echo "Updating $service..."
  aws ecs update-service \
    --cluster $CLUSTER \
    --service "postiz-production-$service" \
    --force-new-deployment
  
  aws ecs wait services-stable \
    --cluster $CLUSTER \
    --services "postiz-production-$service"
done
```

#### 2. Database Maintenance

```bash
# Check for available updates
aws rds describe-pending-maintenance-actions

# Apply updates during maintenance window
aws rds apply-pending-maintenance-action \
  --resource-identifier postiz-production-aurora-cluster \
  --apply-action system-update \
  --opt-in-type immediate
```

### Backup and Recovery

#### 1. Create Manual Backup

```bash
# Create Aurora snapshot
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier postiz-production-aurora-cluster \
  --db-cluster-snapshot-identifier postiz-manual-backup-$(date +%Y%m%d)
```

#### 2. Test Recovery Procedure

```bash
# Restore from snapshot (test environment)
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier postiz-test-restore \
  --snapshot-identifier postiz-manual-backup-20240101
```

## Production Checklist

Before going live, ensure:

- [ ] Domain DNS configured correctly
- [ ] SSL certificates validated and active
- [ ] All secrets properly configured
- [ ] Database migrations completed
- [ ] Application health checks passing
- [ ] Load balancer health checks green
- [ ] Auto-scaling policies tested
- [ ] Monitoring and alerting configured
- [ ] Backup procedures tested
- [ ] Security groups reviewed
- [ ] WAF rules configured
- [ ] Cost monitoring enabled
- [ ] Team access permissions configured

## Support

For deployment issues:
1. Check CloudWatch logs for application errors
2. Verify ECS service status and events
3. Test database connectivity
4. Review security group configurations
5. Check auto-scaling policies

For infrastructure questions, refer to the Terraform documentation and AWS service documentation.