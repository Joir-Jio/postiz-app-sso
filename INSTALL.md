# Postiz SSO Installation Guide

## Overview
This is a modified version of Postiz with SSO (Single Sign-On) integration for seamless authentication and API key management. The system allows external platforms to authenticate users and obtain API keys for automated posting.

## System Requirements

### Minimum Requirements (for <10 users)
- **Memory**: 1.4GB RAM minimum (recommended 2GB)
- **Storage**: 10GB available space
- **CPU**: 1 vCPU (AWS t3.small compatible)
- **OS**: Ubuntu 20.04+ or similar Linux distribution

### Dependencies
- Node.js v20.15.0+
- PostgreSQL 14+
- Redis 6+
- pnpm 10.6.1+
- Git

## Installation Methods

### Option 1: Native Installation (Recommended for t3.small)

#### 1. System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm@10.6.1

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install PM2 for process management
npm install -g pm2
```

#### 2. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE postiz_sso;
CREATE USER postiz_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE postiz_sso TO postiz_user;
\q

# Start and enable services
sudo systemctl start postgresql redis-server
sudo systemctl enable postgresql redis-server
```

#### 3. Application Setup
```bash
# Clone the repository
git clone <your-git-repo-url>
cd postiz-app-sso

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
nano .env
```

#### 4. Environment Configuration
Create `.env` file with the following variables:
```env
# Database
DATABASE_URL="postgresql://postiz_user:your_secure_password@localhost:5432/postiz_sso"

# Redis
REDIS_URL="redis://127.0.0.1:6379"

# JWT Security
JWT_SECRET="your-super-secure-jwt-secret-key-here"
NOT_SECURED=false

# Application URLs
FRONTEND_URL="http://your-domain.com:4200"
BACKEND_URL="http://your-domain.com:3000"

# Google Cloud Storage (if using media features)
GCS_BUCKET_NAME="your-gcs-bucket"
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"

# Optional: Email configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
```

#### 5. Database Migration
```bash
# Push database schema
pnpm run prisma-db-push

# Generate Prisma client
pnpm run prisma:generate
```

#### 6. Build and Start
```bash
# Build the application
pnpm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Docker Installation

#### 1. Prerequisites
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. Docker Setup
```bash
# Clone and setup
git clone <your-git-repo-url>
cd postiz-app-sso

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec backend pnpm run prisma-db-push
```

## Configuration

### PM2 Ecosystem (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'postiz-backend',
      cwd: './apps/backend',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '1G'
    },
    {
      name: 'postiz-frontend', 
      cwd: './apps/frontend',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '512M'
    },
    {
      name: 'postiz-workers',
      cwd: './apps/workers', 
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '512M'
    }
  ]
};
```

### Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSO Integration Usage

### 1. SSO Login Endpoint
```
POST /sso-login
Content-Type: application/json

{
  "token": "your-jwt-token-here"
}
```

### 2. Response Format
```json
{
  "success": true,
  "accessToken": "backend-access-token",
  "apiKey": "encrypted-api-key-for-external-calls"
}
```

### 3. Using API Key for External Calls
```javascript
// Example: Create a post via Public API
const response = await fetch('http://your-domain.com:3000/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    posts: [{
      content: 'Hello from external platform!',
      scheduled: '2024-01-01T10:00:00Z'
    }]
  })
});
```

## Troubleshooting

### Common Issues

1. **Backend won't start - TypeScript errors**
   ```bash
   # Check for compilation errors
   pnpm run typecheck
   
   # If SSO modules have issues, they're disabled in app.module.ts
   # Enable after fixing TypeScript issues
   ```

2. **Database connection failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Test connection
   psql -h localhost -U postiz_user -d postiz_sso
   ```

3. **Redis connection failed**
   ```bash
   # Check Redis status
   sudo systemctl status redis-server
   
   # Test connection
   redis-cli ping
   ```

4. **Out of memory on t3.small**
   ```bash
   # Add swap space
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

### Performance Optimization for t3.small

1. **Node.js Memory Limits**
   ```bash
   # In PM2 ecosystem.config.js
   max_memory_restart: '1G'  # for backend
   max_memory_restart: '512M'  # for frontend/workers
   ```

2. **PostgreSQL Tuning**
   ```bash
   # Edit /etc/postgresql/14/main/postgresql.conf
   shared_buffers = 128MB
   effective_cache_size = 1GB
   maintenance_work_mem = 64MB
   ```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Set NOT_SECURED=false in production
- [ ] Configure firewall (only ports 22, 80, 443)
- [ ] Set up SSL certificates
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

## Monitoring

### Log Files
- Backend: `~/.pm2/logs/postiz-backend-out.log`
- Frontend: `~/.pm2/logs/postiz-frontend-out.log`
- Workers: `~/.pm2/logs/postiz-workers-out.log`

### Health Checks
- Backend: `curl http://localhost:3000/health`
- Frontend: `curl http://localhost:4200`
- Database: `pg_isready -h localhost -p 5432`
- Redis: `redis-cli ping`

## Backup Strategy

```bash
# Database backup
pg_dump -h localhost -U postiz_user postiz_sso > backup_$(date +%Y%m%d).sql

# Redis backup
redis-cli --rdb dump_$(date +%Y%m%d).rdb

# Application backup
tar -czf postiz_app_$(date +%Y%m%d).tar.gz /path/to/postiz-app-sso
```

## Support

For issues specific to this SSO implementation:
1. Check logs in `~/.pm2/logs/`
2. Verify environment variables in `.env`
3. Test SSO endpoint with valid JWT token
4. Ensure all services are running: `pm2 status`

## Memory Usage Breakdown (t3.small - 2GB)
- Backend: ~800MB
- Frontend: ~300MB  
- Workers: ~200MB
- PostgreSQL: ~100MB
- Redis: ~50MB
- System: ~250MB
- **Total**: ~1.7GB (with 300MB buffer)