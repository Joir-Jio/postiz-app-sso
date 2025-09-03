# Postiz SSO AWS Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Postiz SSO to AWS using Docker containers, ECS Fargate, and Infrastructure as Code (Terraform).

## Architecture

### Production Architecture
```
Internet → ALB → ECS Fargate Tasks → RDS PostgreSQL
                                   → ElastiCache Redis
                                   → S3 Media Storage
```

### Service Components
- **Frontend**: Next.js application (Port 4200)
- **Backend**: NestJS API server (Port 3000) 
- **Workers**: Background task processor
- **Cron**: Scheduled task manager
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache Redis
- **Storage**: AWS S3 for media files
- **Load Balancer**: AWS Application Load Balancer
- **Container Platform**: AWS ECS Fargate

## Prerequisites

### Required Tools
- **Docker** (v20.10+)
- **Terraform** (v1.5+)
- **AWS CLI** (v2.0+)
- **Node.js** (v20.15.0)
- **pnpm** (v10.6.1)

### AWS Account Requirements
- AWS Account with appropriate permissions
- Domain name registered (for SSL certificates)
- ACM SSL certificate for your domain

### Required AWS Services
- EC2 (for VPC, subnets, security groups)
- ECS Fargate
- RDS PostgreSQL
- ElastiCache Redis
- Application Load Balancer
- S3 Storage
- CloudWatch Logging/Monitoring
- Systems Manager Parameter Store
- Route 53 (for DNS)

## Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd postiz-app-sso

# Copy environment template
cp .env.production.example .env.production

# Edit production environment variables
nano .env.production
```

### 2. Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Build and Deploy Infrastructure

```bash
# Initialize Terraform
cd terraform
terraform init

# Plan infrastructure changes
terraform plan -var="domain_name=yourdomain.com" \
               -var="certificate_arn=arn:aws:acm:us-east-1:account:certificate/cert-id" \
               -var="alert_email=admin@yourdomain.com"

# Apply infrastructure
terraform apply
```

### 4. Build and Push Docker Images

```bash
# Build all services
./scripts/docker-build.sh -v 1.0.0 -p -c

# Or build individual services
docker build --target frontend -t your-registry/postiz/frontend:1.0.0 .
docker build --target backend -t your-registry/postiz/backend:1.0.0 .
docker build --target workers -t your-registry/postiz/workers:1.0.0 .
docker build --target cron -t your-registry/postiz/cron:1.0.0 .
```

### 5. Deploy to ECS

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition.json

# Create ECS services
aws ecs create-service --cluster postiz-sso \
                      --service-name postiz-frontend \
                      --task-definition postiz-sso:1 \
                      --desired-count 2

# Repeat for backend, workers, and cron services
```

## Detailed Deployment Steps

### Step 1: Pre-deployment Checklist

- [ ] AWS account with required permissions
- [ ] Domain name and SSL certificate ready
- [ ] Environment variables configured
- [ ] Docker registry accessible
- [ ] Database credentials secure
- [ ] Social media API keys configured

### Step 2: Infrastructure Deployment

#### 2.1 Terraform Configuration

```bash
# Navigate to terraform directory
cd terraform

# Create terraform.tfvars file
cat > terraform.tfvars << EOF
aws_region = "us-east-1"
environment = "prod"
project_name = "postiz-sso"
domain_name = "yourdomain.com"
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
alert_email = "admin@yourdomain.com"
vpc_cidr = "10.0.0.0/16"
db_instance_class = "db.t3.small"
redis_node_type = "cache.t3.micro"
ecs_cpu = 2048
ecs_memory = 4096
EOF

# Initialize and apply
terraform init
terraform plan
terraform apply -auto-approve
```

#### 2.2 Set Up Secrets in Parameter Store

```bash
# Database password
aws ssm put-parameter --name "/postiz/database-password" \
                     --value "your-secure-password" \
                     --type "SecureString"

# JWT Secret
aws ssm put-parameter --name "/postiz/jwt-secret" \
                     --value "$(openssl rand -hex 32)" \
                     --type "SecureString"

# Social media API secrets
aws ssm put-parameter --name "/postiz/twitter-client-secret" \
                     --value "your-twitter-secret" \
                     --type "SecureString"

aws ssm put-parameter --name "/postiz/facebook-client-secret" \
                     --value "your-facebook-secret" \
                     --type "SecureString"
```

### Step 3: Application Deployment

#### 3.1 Build Docker Images

```bash
# Set registry URL
export REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
export VERSION=1.0.0

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REGISTRY

# Build and push images
./scripts/docker-build.sh -v $VERSION -r $REGISTRY -p -c -s
```

#### 3.2 Update Task Definition

```bash
# Update image URIs in task definition
sed -i "s/YOUR_REGISTRY/$REGISTRY/g" aws/ecs-task-definition.json
sed -i "s/YOUR_ACCOUNT_ID/123456789012/g" aws/ecs-task-definition.json

# Register task definition
aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition.json
```

#### 3.3 Create ECS Services

```bash
# Get subnet and security group IDs from Terraform output
SUBNET_IDS=$(terraform output -json private_subnet_ids | jq -r '.[] | @sh' | tr -d "'" | tr '\n' ',' | sed 's/,$//')
SECURITY_GROUP_ID=$(terraform output -raw ecs_security_group_id)

# Create frontend service
aws ecs create-service \
    --cluster postiz-sso \
    --service-name postiz-frontend \
    --task-definition postiz-sso:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=$(terraform output -raw frontend_target_group_arn),containerName=postiz-frontend,containerPort=4200"

# Create backend service
aws ecs create-service \
    --cluster postiz-sso \
    --service-name postiz-backend \
    --task-definition postiz-sso:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=$(terraform output -raw backend_target_group_arn),containerName=postiz-backend,containerPort=3000"

# Create workers service (no load balancer)
aws ecs create-service \
    --cluster postiz-sso \
    --service-name postiz-workers \
    --task-definition postiz-sso:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}"

# Create cron service (single instance)
aws ecs create-service \
    --cluster postiz-sso \
    --service-name postiz-cron \
    --task-definition postiz-sso:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}"
```

### Step 4: DNS Configuration

```bash
# Get load balancer DNS name
ALB_DNS=$(terraform output -raw load_balancer_dns_name)

# Create Route 53 records
aws route53 change-resource-record-sets --hosted-zone-id YOUR_HOSTED_ZONE_ID --change-batch '{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "yourdomain.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "'$ALB_DNS'"}]
      }
    },
    {
      "Action": "UPSERT", 
      "ResourceRecordSet": {
        "Name": "api.yourdomain.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "'$ALB_DNS'"}]
      }
    }
  ]
}'
```

## Environment-Specific Configurations

### Production Environment

**Characteristics:**
- High availability with multi-AZ deployment
- Auto-scaling enabled
- Enhanced monitoring and alerting
- Automated backups
- Security hardening

**Resource Specifications:**
```bash
# ECS Task Resources
CPU: 2048 (2 vCPU)
Memory: 4096 MB (4 GB)

# RDS Database
Instance: db.t3.small
Storage: 100 GB (auto-scaling to 1 TB)
Multi-AZ: Enabled
Backup Retention: 7 days

# ElastiCache Redis  
Instance: cache.t3.small
Backup: Enabled

# Load Balancer
Type: Application Load Balancer
Scheme: Internet-facing
IP Address Type: IPv4
```

### Staging Environment

**Characteristics:**
- Single AZ deployment
- Reduced resource allocation
- Basic monitoring
- Cost-optimized

**Resource Specifications:**
```bash
# ECS Task Resources
CPU: 1024 (1 vCPU)
Memory: 2048 MB (2 GB)

# RDS Database
Instance: db.t3.micro
Storage: 20 GB
Multi-AZ: Disabled
Backup Retention: 3 days

# ElastiCache Redis
Instance: cache.t3.micro
Backup: Disabled
```

## Monitoring and Observability

### CloudWatch Setup

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
    --dashboard-name "Postiz-SSO-Production" \
    --dashboard-body file://monitoring/cloudwatch-dashboard.json

# Deploy CloudWatch alarms
cd monitoring
terraform apply -var="alert_email=admin@yourdomain.com"
```

### Key Metrics to Monitor

**Application Performance:**
- Response time (< 2 seconds target)
- Error rate (< 1% target)
- Throughput (requests/minute)
- Queue processing lag

**Infrastructure Health:**
- CPU utilization (< 80%)
- Memory utilization (< 85%)
- Database connections
- Cache hit ratio

**Business Metrics:**
- Social media posting success rate
- User authentication failures
- API rate limit violations
- Media upload failures

## Troubleshooting

### Common Issues

#### 1. Service Deployment Failures

**Symptoms:** ECS tasks failing to start or staying in PENDING state

**Solutions:**
```bash
# Check task logs
aws logs describe-log-groups --log-group-name-prefix "/ecs/postiz"
aws logs get-log-events --log-group-name "/ecs/postiz-backend" --log-stream-name "ecs/postiz-backend/task-id"

# Check service events  
aws ecs describe-services --cluster postiz-sso --services postiz-backend

# Verify task definition
aws ecs describe-task-definition --task-definition postiz-sso:latest
```

#### 2. Database Connection Issues

**Symptoms:** Backend services cannot connect to RDS

**Solutions:**
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Test connectivity from ECS task
aws ecs run-task --cluster postiz-sso \
                --task-definition postiz-sso:latest \
                --overrides '{"containerOverrides":[{"name":"postiz-backend","command":["sh","-c","nc -zv database-endpoint 5432"]}]}'

# Check parameter store values
aws ssm get-parameter --name "/postiz/database-url" --with-decryption
```

#### 3. Load Balancer Health Check Failures

**Symptoms:** ALB shows unhealthy targets

**Solutions:**
```bash
# Check target group health
aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...

# Verify health check endpoint
curl -I http://task-ip:3000/health

# Check application logs for errors
aws logs filter-log-events --log-group-name "/ecs/postiz-backend" --filter-pattern "ERROR"
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
```

#### 2. Cache Optimization

```bash
# Monitor Redis performance
aws cloudwatch get-metric-statistics \
    --namespace AWS/ElastiCache \
    --metric-name CacheHitRate \
    --dimensions Name=CacheClusterId,Value=postiz-sso-redis \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-02T00:00:00Z \
    --period 3600 \
    --statistics Average
```

#### 3. Application Optimization

```bash
# Enable compression
# Add to ALB listener rules

# Implement CDN
aws cloudfront create-distribution --distribution-config file://cdn-config.json
```

## Security Best Practices

### 1. Network Security

- **VPC**: Isolated network environment
- **Private Subnets**: Database and cache in private subnets
- **Security Groups**: Restrictive inbound/outbound rules
- **NACLs**: Additional network-level protection

### 2. Application Security

- **Secrets Management**: AWS Parameter Store for sensitive data
- **Encryption**: Data encryption in transit and at rest
- **Authentication**: JWT-based authentication
- **Rate Limiting**: API rate limiting implemented

### 3. Container Security

- **Non-root User**: Containers run as non-root user
- **Security Scanning**: Trivy security scanning in build pipeline
- **Minimal Base Images**: Alpine-based images
- **Image Signing**: Container image signing

### 4. Monitoring and Auditing

- **CloudTrail**: API call logging
- **VPC Flow Logs**: Network traffic monitoring
- **Application Logs**: Structured logging with correlation IDs
- **Security Alerts**: Real-time security event notifications

## Rollback Procedures

### 1. Application Rollback

```bash
# Rollback to previous task definition
aws ecs update-service \
    --cluster postiz-sso \
    --service postiz-backend \
    --task-definition postiz-sso:previous-revision

# Monitor rollback progress
aws ecs describe-services --cluster postiz-sso --services postiz-backend
```

### 2. Database Rollback

```bash
# Restore from automated backup
aws rds restore-db-instance-from-db-snapshot \
    --db-instance-identifier postiz-sso-db-restored \
    --db-snapshot-identifier rds:postiz-sso-db-2024-01-01-03-00

# Update database endpoint in Parameter Store
aws ssm put-parameter --name "/postiz/database-url" \
                     --value "postgresql://user:pass@new-endpoint:5432/postiz" \
                     --type "SecureString" \
                     --overwrite
```

### 3. Infrastructure Rollback

```bash
# Rollback Terraform changes
terraform plan -target=aws_ecs_service.backend
terraform apply -target=aws_ecs_service.backend
```

## Maintenance Windows

### Scheduled Maintenance

**Weekly Maintenance Window:** Sunday 02:00-04:00 UTC

**Tasks:**
- Security patches
- Database maintenance
- Cache cleanup  
- Log rotation
- Health checks

**Procedure:**
```bash
# 1. Drain traffic from services
aws ecs update-service --cluster postiz-sso --service postiz-backend --desired-count 0

# 2. Apply updates
terraform apply

# 3. Restore traffic
aws ecs update-service --cluster postiz-sso --service postiz-backend --desired-count 2
```

## Cost Optimization

### Resource Right-Sizing

**Monitor Usage:**
```bash
# Check ECS service utilization
aws cloudwatch get-metric-statistics \
    --namespace AWS/ECS \
    --metric-name CPUUtilization \
    --dimensions Name=ServiceName,Value=postiz-backend Name=ClusterName,Value=postiz-sso
```

**Optimization Strategies:**
- Use Spot instances for non-critical workloads
- Implement auto-scaling policies
- Schedule non-production environments
- Use Reserved Instances for predictable workloads

### Monitoring Costs

```bash
# Set up billing alerts
aws budgets create-budget --account-id 123456789012 --budget '{
  "BudgetName": "Postiz-SSO-Monthly",
  "BudgetLimit": {
    "Amount": "500",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}'
```

## Support and Contact

For deployment issues or questions:

- **Documentation**: Check this guide and inline comments
- **Logs**: Review CloudWatch logs for error details  
- **Monitoring**: Use CloudWatch dashboards for system health
- **Alerts**: Configure SNS notifications for critical issues

## Appendix

### A. Useful Commands

```bash
# Quick service restart
aws ecs update-service --cluster postiz-sso --service postiz-backend --force-new-deployment

# Scale service
aws ecs update-service --cluster postiz-sso --service postiz-backend --desired-count 3

# View logs in real-time
aws logs tail /ecs/postiz-backend --follow

# Check service health
aws ecs describe-services --cluster postiz-sso --services postiz-backend --query 'services[0].{Name:serviceName,Status:status,Running:runningCount,Desired:desiredCount}'
```

### B. Resource Limits

**ECS Fargate Limits:**
- Max CPU: 16 vCPU
- Max Memory: 120 GB  
- Max Tasks per Service: 1000

**RDS Limits:**
- Max Storage: 64 TiB
- Max IOPS: 80,000
- Max Connections: Depends on instance class

### C. Emergency Contacts

**On-Call Rotation:**
- Primary: DevOps Team
- Secondary: Backend Team  
- Escalation: Engineering Manager

This completes the comprehensive deployment guide for Postiz SSO on AWS.