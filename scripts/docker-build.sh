#!/bin/bash
# Docker Build Script for Postiz SSO Production
# Builds all production images with proper tagging and optimization

set -euo pipefail

# Configuration
REGISTRY=${REGISTRY:-"your-registry.com"}
PROJECT_NAME=${PROJECT_NAME:-"postiz"}
VERSION=${VERSION:-"latest"}
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running or not accessible"
        exit 1
    fi
}

# Check if required tools are available
check_dependencies() {
    local deps=("docker" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            log_error "Required dependency '$dep' is not installed"
            exit 1
        fi
    done
}

# Build individual service
build_service() {
    local service=$1
    local tag="${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
    local latest_tag="${REGISTRY}/${PROJECT_NAME}/${service}:latest"
    
    log_info "Building $service image..."
    
    docker build \
        --target "$service" \
        --build-arg VERSION="$VERSION" \
        --build-arg BUILD_DATE="$BUILD_DATE" \
        --build-arg GIT_COMMIT="$GIT_COMMIT" \
        --label "org.postiz.version=$VERSION" \
        --label "org.postiz.build-date=$BUILD_DATE" \
        --label "org.postiz.git-commit=$GIT_COMMIT" \
        --label "org.postiz.service=$service" \
        -t "$tag" \
        -t "$latest_tag" \
        .
    
    if [ $? -eq 0 ]; then
        log_success "Successfully built $service image: $tag"
        return 0
    else
        log_error "Failed to build $service image"
        return 1
    fi
}

# Build all services
build_all_services() {
    local services=("frontend" "backend" "workers" "cron")
    local failed_builds=()
    
    log_info "Starting build process for all services..."
    
    for service in "${services[@]}"; do
        if ! build_service "$service"; then
            failed_builds+=("$service")
        fi
    done
    
    if [ ${#failed_builds[@]} -eq 0 ]; then
        log_success "All services built successfully!"
        return 0
    else
        log_error "Failed to build services: ${failed_builds[*]}"
        return 1
    fi
}

# Push images to registry
push_images() {
    if [ "$PUSH_IMAGES" != "true" ]; then
        log_info "Skipping image push (PUSH_IMAGES != true)"
        return 0
    fi
    
    local services=("frontend" "backend" "workers" "cron")
    
    log_info "Pushing images to registry..."
    
    for service in "${services[@]}"; do
        local tag="${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
        local latest_tag="${REGISTRY}/${PROJECT_NAME}/${service}:latest"
        
        log_info "Pushing $service images..."
        
        if docker push "$tag" && docker push "$latest_tag"; then
            log_success "Successfully pushed $service images"
        else
            log_error "Failed to push $service images"
            return 1
        fi
    done
    
    log_success "All images pushed successfully!"
}

# Clean up old images
cleanup_images() {
    if [ "$CLEANUP_IMAGES" != "true" ]; then
        log_info "Skipping image cleanup (CLEANUP_IMAGES != true)"
        return 0
    fi
    
    log_info "Cleaning up dangling images..."
    
    # Remove dangling images
    docker image prune -f >/dev/null 2>&1 || true
    
    # Remove old build cache
    docker builder prune -f >/dev/null 2>&1 || true
    
    log_success "Image cleanup completed"
}

# Validate built images
validate_images() {
    local services=("frontend" "backend" "workers" "cron")
    
    log_info "Validating built images..."
    
    for service in "${services[@]}"; do
        local tag="${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
        
        if docker inspect "$tag" >/dev/null 2>&1; then
            log_success "Image $tag is valid"
        else
            log_error "Image $tag is invalid or missing"
            return 1
        fi
    done
    
    log_success "All images validated successfully!"
}

# Security scan (if trivy is available)
security_scan() {
    if [ "$SECURITY_SCAN" != "true" ]; then
        log_info "Skipping security scan (SECURITY_SCAN != true)"
        return 0
    fi
    
    if ! command -v trivy >/dev/null 2>&1; then
        log_warning "Trivy not found, skipping security scan"
        return 0
    fi
    
    local services=("frontend" "backend" "workers" "cron")
    
    log_info "Running security scans..."
    
    for service in "${services[@]}"; do
        local tag="${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
        
        log_info "Scanning $service for vulnerabilities..."
        
        if trivy image --quiet --format table "$tag"; then
            log_success "Security scan completed for $service"
        else
            log_warning "Security scan found issues in $service"
        fi
    done
}

# Generate build report
generate_build_report() {
    local report_file="build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "=== Postiz SSO Build Report ==="
        echo "Build Date: $BUILD_DATE"
        echo "Version: $VERSION"
        echo "Git Commit: $GIT_COMMIT"
        echo "Registry: $REGISTRY"
        echo ""
        echo "=== Built Images ==="
        
        for service in frontend backend workers cron; do
            local tag="${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
            if docker inspect "$tag" >/dev/null 2>&1; then
                local size=$(docker images --format "table {{.Size}}" "$tag" | tail -n1)
                echo "$service: $tag (Size: $size)"
            fi
        done
        
        echo ""
        echo "=== Docker Info ==="
        docker version
        
    } > "$report_file"
    
    log_success "Build report generated: $report_file"
}

# Help function
show_help() {
    cat << EOF
Docker Build Script for Postiz SSO

Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -v, --version VERSION   Set build version (default: latest)
    -r, --registry URL      Set registry URL  
    -p, --push              Push images to registry
    -c, --cleanup           Clean up old images after build
    -s, --scan              Run security scan on built images
    --no-cache              Build without using cache
    --parallel              Build services in parallel (experimental)

Environment Variables:
    REGISTRY                Docker registry URL
    PROJECT_NAME           Project name (default: postiz)
    VERSION                Build version (default: latest) 
    PUSH_IMAGES            Push images after build (true/false)
    CLEANUP_IMAGES         Clean up after build (true/false)
    SECURITY_SCAN          Run security scan (true/false)

Examples:
    $0                                      # Build all services
    $0 -v 1.2.3 -p                        # Build version 1.2.3 and push
    $0 --registry my-registry.com -p -c    # Build, push, and cleanup
    $0 --scan                              # Build and run security scan

EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -r|--registry)
                REGISTRY="$2"
                shift 2
                ;;
            -p|--push)
                PUSH_IMAGES="true"
                shift
                ;;
            -c|--cleanup)
                CLEANUP_IMAGES="true"
                shift
                ;;
            -s|--scan)
                SECURITY_SCAN="true"
                shift
                ;;
            --no-cache)
                DOCKER_BUILD_ARGS="--no-cache"
                shift
                ;;
            --parallel)
                BUILD_PARALLEL="true"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Main function
main() {
    # Parse arguments
    parse_args "$@"
    
    # Show configuration
    log_info "Build Configuration:"
    log_info "  Registry: $REGISTRY"
    log_info "  Project: $PROJECT_NAME"
    log_info "  Version: $VERSION"
    log_info "  Git Commit: $GIT_COMMIT"
    log_info "  Build Date: $BUILD_DATE"
    echo ""
    
    # Check dependencies
    check_dependencies
    check_docker
    
    # Build services
    if ! build_all_services; then
        log_error "Build failed!"
        exit 1
    fi
    
    # Validate images
    validate_images
    
    # Security scan
    security_scan
    
    # Push images
    push_images
    
    # Cleanup
    cleanup_images
    
    # Generate report
    generate_build_report
    
    log_success "Build process completed successfully!"
}

# Run main function
main "$@"