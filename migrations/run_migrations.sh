#!/bin/bash

# Multi-Product SSO Integration Migration Runner
# This script runs all migration files in the correct order

set -e  # Exit on any error

# Configuration
DB_NAME="${DATABASE_NAME:-postiz}"
DB_USER="${DATABASE_USER:-postgres}"
DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if psql is available
check_psql() {
    if ! command -v psql &> /dev/null; then
        print_status $RED "Error: psql command not found. Please install PostgreSQL client."
        exit 1
    fi
}

# Function to test database connection
test_connection() {
    print_status $BLUE "Testing database connection..."
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
        print_status $GREEN "✓ Database connection successful"
    else
        print_status $RED "✗ Database connection failed"
        print_status $YELLOW "Please check your database configuration:"
        print_status $YELLOW "  DB_HOST: $DB_HOST"
        print_status $YELLOW "  DB_PORT: $DB_PORT"
        print_status $YELLOW "  DB_USER: $DB_USER"
        print_status $YELLOW "  DB_NAME: $DB_NAME"
        exit 1
    fi
}

# Function to run a migration file
run_migration() {
    local migration_file=$1
    local description=$2
    
    print_status $BLUE "Running migration: $migration_file"
    print_status $YELLOW "Description: $description"
    
    if [ ! -f "$migration_file" ]; then
        print_status $RED "Error: Migration file $migration_file not found"
        exit 1
    fi
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file"; then
        print_status $GREEN "✓ Migration completed successfully: $migration_file"
    else
        print_status $RED "✗ Migration failed: $migration_file"
        exit 1
    fi
    
    echo # Empty line for readability
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -d, --dry-run       Show what migrations would be run without executing them"
    echo "  -s, --sample-data   Include sample data migration (default: yes)"
    echo "  --no-sample-data    Skip sample data migration"
    echo "  --core-only         Run only core table migrations (1-4)"
    echo "  --indexes-only      Run only index optimization migration (5)"
    echo ""
    echo "Environment variables:"
    echo "  DATABASE_NAME       Database name (default: postiz)"
    echo "  DATABASE_USER       Database user (default: postgres)"
    echo "  DATABASE_HOST       Database host (default: localhost)"
    echo "  DATABASE_PORT       Database port (default: 5432)"
    echo ""
    echo "Examples:"
    echo "  $0                           # Run all migrations including sample data"
    echo "  $0 --no-sample-data         # Run all migrations except sample data"
    echo "  $0 --core-only               # Run only core table migrations"
    echo "  $0 --dry-run                 # Show what would be executed"
    echo ""
}

# Function to show migration plan
show_plan() {
    local include_sample=$1
    local core_only=$2
    local indexes_only=$3
    
    print_status $BLUE "Migration Plan:"
    echo "----------------------------------------"
    
    if [ "$indexes_only" = true ]; then
        echo "5. 005_create_additional_indexes.sql - Performance optimizations"
        return
    fi
    
    if [ "$core_only" = false ]; then
        echo "1. 001_create_saas_products.sql - SaaS products registration table"
        echo "2. 002_create_product_users.sql - Product-user mapping table"
        echo "3. 003_create_user_gcs_mappings.sql - GCS path mapping table"
        echo "4. 004_create_media_references.sql - External media references table"
    fi
    
    if [ "$core_only" = false ]; then
        echo "5. 005_create_additional_indexes.sql - Performance optimizations"
    fi
    
    if [ "$include_sample" = true ] && [ "$core_only" = false ]; then
        echo "6. 006_sample_data.sql - Sample data for testing"
    fi
    
    echo "----------------------------------------"
}

# Parse command line arguments
DRY_RUN=false
INCLUDE_SAMPLE=true
CORE_ONLY=false
INDEXES_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -s|--sample-data)
            INCLUDE_SAMPLE=true
            shift
            ;;
        --no-sample-data)
            INCLUDE_SAMPLE=false
            shift
            ;;
        --core-only)
            CORE_ONLY=true
            shift
            ;;
        --indexes-only)
            INDEXES_ONLY=true
            shift
            ;;
        *)
            print_status $RED "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
print_status $GREEN "Multi-Product SSO Integration Migration Runner"
print_status $GREEN "=============================================="
echo

# Show configuration
print_status $BLUE "Configuration:"
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST:$DB_PORT"
echo "  User: $DB_USER"
echo "  Include Sample Data: $INCLUDE_SAMPLE"
echo "  Core Only: $CORE_ONLY"
echo "  Indexes Only: $INDEXES_ONLY"
echo "  Dry Run: $DRY_RUN"
echo

# Show migration plan
show_plan $INCLUDE_SAMPLE $CORE_ONLY $INDEXES_ONLY
echo

# If dry run, exit here
if [ "$DRY_RUN" = true ]; then
    print_status $YELLOW "Dry run completed. No migrations were executed."
    exit 0
fi

# Check dependencies
check_psql
test_connection

# Confirmation prompt
read -p "Do you want to proceed with the migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status $YELLOW "Migration cancelled by user"
    exit 0
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_status $GREEN "Starting migrations..."
echo

# Run migrations based on options
if [ "$INDEXES_ONLY" = true ]; then
    run_migration "$SCRIPT_DIR/005_create_additional_indexes.sql" "Performance optimizations"
else
    if [ "$CORE_ONLY" = false ]; then
        # Run core table migrations
        run_migration "$SCRIPT_DIR/001_create_saas_products.sql" "Create SaaS products registration table"
        run_migration "$SCRIPT_DIR/002_create_product_users.sql" "Create product-user mapping table"
        run_migration "$SCRIPT_DIR/003_create_user_gcs_mappings.sql" "Create GCS path mapping table"
        run_migration "$SCRIPT_DIR/004_create_media_references.sql" "Create external media references table"
    fi
    
    if [ "$CORE_ONLY" = false ]; then
        # Run optimization migration
        run_migration "$SCRIPT_DIR/005_create_additional_indexes.sql" "Add performance optimizations and indexes"
        
        # Run sample data migration if requested
        if [ "$INCLUDE_SAMPLE" = true ]; then
            run_migration "$SCRIPT_DIR/006_sample_data.sql" "Insert sample data for testing"
        fi
    fi
fi

print_status $GREEN "All migrations completed successfully!"
print_status $BLUE "Next steps:"
echo "1. Verify the tables were created by running: \\dt in psql"
echo "2. Check sample data (if loaded) by querying the saas_products table"
echo "3. Review the README.md for usage examples and maintenance tasks"
echo "4. Consider setting up regular maintenance tasks for SSO session cleanup"
echo

print_status $GREEN "Migration Summary:"
echo "✓ Multi-product SSO integration database schema created"
echo "✓ Comprehensive indexing for optimal performance"
echo "✓ Data isolation and security constraints enforced"
echo "✓ GCS path mapping with flexible pattern support"
echo "✓ External media reference system without re-uploading"

if [ "$INCLUDE_SAMPLE" = true ] && [ "$CORE_ONLY" = false ] && [ "$INDEXES_ONLY" = false ]; then
    echo "✓ Sample data loaded for testing"
    echo ""
    print_status $YELLOW "Test the system by running sample queries from README.md"
fi