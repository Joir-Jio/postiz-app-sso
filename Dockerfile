# Multi-stage production Dockerfile for Postiz SSO
# Optimized for AWS ECS/Fargate deployment with security best practices

# ============================================================================
# Base Image with Common Dependencies
# ============================================================================
FROM node:20-alpine AS base

# Install system dependencies and security updates
RUN apk add --no-cache \
    dumb-init \
    tini \
    ca-certificates \
    bash \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S postiz -u 1001

# Install pnpm globally
RUN npm install -g pnpm@10.6.1 --unsafe-perm

# Set working directory
WORKDIR /app

# Copy package.json files for dependency caching
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/workers/package.json ./apps/workers/
COPY apps/cron/package.json ./apps/cron/
COPY libraries/nestjs-libraries/package.json ./libraries/nestjs-libraries/

# ============================================================================
# Dependencies Stage
# ============================================================================
FROM base AS deps

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# ============================================================================
# Builder Stage - Compile TypeScript and Build Apps
# ============================================================================
FROM base AS builder

# Install all dependencies including devDependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm run prisma-generate

# Build all applications with optimized memory settings
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run build

# ============================================================================
# Frontend Production Image
# ============================================================================
FROM base AS frontend

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules

# Copy built frontend application
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/apps/frontend/next.config.* ./apps/frontend/

# Copy shared libraries and root package.json
COPY --from=builder /app/libraries ./libraries
COPY --from=builder /app/package.json ./

# Set user ownership
RUN chown -R postiz:nodejs /app

USER postiz

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4200/api/health || exit 1

# Start frontend with proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pnpm", "--filter", "postiz-frontend", "start"]

# ============================================================================
# Backend Production Image
# ============================================================================
FROM base AS backend

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built backend application
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/libraries ./libraries
COPY --from=builder /app/package.json ./

# Set user ownership
RUN chown -R postiz:nodejs /app

USER postiz

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start backend with proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pnpm", "--filter", "postiz-backend", "start"]

# ============================================================================
# Workers Production Image
# ============================================================================
FROM base AS workers

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built workers application
COPY --from=builder /app/apps/workers/dist ./apps/workers/dist
COPY --from=builder /app/apps/workers/package.json ./apps/workers/
COPY --from=builder /app/libraries ./libraries
COPY --from=builder /app/package.json ./

# Set user ownership
RUN chown -R postiz:nodejs /app

USER postiz

# No exposed ports for workers (internal service)

# Health check via process monitoring
HEALTHCHECK --interval=60s --timeout=5s --start-period=60s --retries=3 \
    CMD pgrep -f "workers" || exit 1

# Start workers with proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pnpm", "--filter", "postiz-workers", "start"]

# ============================================================================
# Cron Production Image
# ============================================================================
FROM base AS cron

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built cron application
COPY --from=builder /app/apps/cron/dist ./apps/cron/dist
COPY --from=builder /app/apps/cron/package.json ./apps/cron/
COPY --from=builder /app/libraries ./libraries
COPY --from=builder /app/package.json ./

# Set user ownership
RUN chown -R postiz:nodejs /app

USER postiz

# No exposed ports for cron (internal service)

# Health check via process monitoring
HEALTHCHECK --interval=60s --timeout=5s --start-period=60s --retries=3 \
    CMD pgrep -f "cron" || exit 1

# Start cron with proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pnpm", "--filter", "postiz-cron", "start"]