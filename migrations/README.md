# Multi-Product SSO Integration Database Migrations

This directory contains comprehensive database migration files for implementing a multi-product SSO integration system in Postiz. The system supports multiple SaaS products sharing one Postiz instance with complete data isolation and seamless media access.

## Overview

The migration creates a robust system that enables:

- **Multiple SaaS products** (video-generation, shopify-app, etc.) to integrate with one Postiz instance
- **User path mapping** for GCS storage with custom paths like "K7mN9pQx2R-DEV/1", "62152016094", "9"
- **External media references** without re-uploading files to Postiz
- **Complete data isolation** between different products
- **Zero-friction SSO flow** with automatic user mapping and media pre-loading

## Migration Files

### Core Tables

1. **001_create_saas_products.sql** - Product registration and configuration
   - Stores product metadata, API keys, SSO settings
   - GCS bucket configuration for each product
   - Feature flags and data isolation settings

2. **002_create_product_users.sql** - User mapping between products and Postiz
   - Maps external product users to Postiz users
   - SSO session management and token verification
   - Product-specific permissions and preferences

3. **003_create_user_gcs_mappings.sql** - GCS path mapping with custom paths
   - Handles complex path patterns like "K7mN9pQx2R-DEV/1", "62152016094"
   - Usage tracking and access control
   - Flexible path generation patterns

4. **004_create_media_references.sql** - External file references with metadata
   - References to GCS files without re-uploading
   - Rich metadata storage (EXIF, thumbnails, etc.)
   - Import queue management and sync status

### Optimizations

5. **005_create_additional_indexes.sql** - Performance optimizations
   - Cross-table query optimizations
   - SSO authentication indexes
   - Media sync and import queue indexes
   - Analytics and reporting optimizations

6. **006_sample_data.sql** - Sample data for testing
   - Example products: video-generation, shopify-app, content-creator
   - Sample users with realistic GCS path patterns
   - Test media references with various file types

## Database Schema

### Table Relationships

```
saas_products (1) ----< (N) product_users
    |                          |
    |                          v
    |                   user_gcs_mappings (1) ----< (N) media_references
    |                          |
    v                          v
Organization <-------- User (existing Postiz tables)
```

### Key Features

- **UUID Primary Keys** - Following Postiz conventions
- **Soft Deletes** - All tables support soft deletion with `deleted_at`
- **Audit Timestamps** - `created_at` and `updated_at` with automatic triggers
- **JSONB Fields** - Flexible metadata storage for extensibility
- **Comprehensive Indexing** - Optimized for common query patterns

## GCS Path Pattern Examples

The system supports various GCS path patterns:

```sql
-- Pattern: alphanumeric-dev
-- Example: "K7mN9pQx2R-DEV/1"
-- Full path: users/video-generation/K7mN9pQx2R-DEV/1

-- Pattern: numeric-id  
-- Example: "62152016094"
-- Full path: users/video-generation/62152016094

-- Pattern: simple-numeric
-- Example: "9"
-- Full path: stores/9

-- Pattern: custom
-- Example: "shop_12345/media"
-- Full path: stores/shop_12345/media
```

## Installation Instructions

### Prerequisites

- PostgreSQL database with Postiz schema already installed
- Database user with CREATE TABLE permissions
- Existing User and Organization records (or modify sample data accordingly)

### Step 1: Run Core Migrations

Execute the migrations in order:

```bash
# 1. Create SaaS products table
psql -d your_database -f 001_create_saas_products.sql

# 2. Create product users mapping
psql -d your_database -f 002_create_product_users.sql

# 3. Create GCS path mappings
psql -d your_database -f 003_create_user_gcs_mappings.sql

# 4. Create media references
psql -d your_database -f 004_create_media_references.sql

# 5. Add performance indexes
psql -d your_database -f 005_create_additional_indexes.sql
```

### Step 2: Load Sample Data (Optional)

```bash
# 6. Load sample data for testing
psql -d your_database -f 006_sample_data.sql
```

### Step 3: Verify Installation

Run verification queries:

```sql
-- Check table creation
SELECT tablename FROM pg_tables 
WHERE tablename IN ('saas_products', 'product_users', 'user_gcs_mappings', 'media_references');

-- Check sample data (if loaded)
SELECT product_key, product_name, status FROM saas_products;

-- Verify relationships
SELECT 
    sp.product_name,
    COUNT(pu.id) as user_count,
    COUNT(ugm.id) as gcs_mappings,
    COUNT(mr.id) as media_references
FROM saas_products sp
LEFT JOIN product_users pu ON sp.id = pu.product_id
LEFT JOIN user_gcs_mappings ugm ON sp.id = ugm.product_id  
LEFT JOIN media_references mr ON sp.id = mr.product_id
WHERE sp.deleted_at IS NULL
GROUP BY sp.id, sp.product_name;
```

## Usage Examples

### Register a New Product

```sql
INSERT INTO saas_products (
    product_key,
    product_name,
    base_url,
    sso_enabled,
    gcs_bucket_name,
    gcs_base_path,
    status
) VALUES (
    'my-new-product',
    'My SaaS Product',
    'https://myproduct.example.com',
    true,
    'my-product-bucket',
    'users/my-product',
    'active'
);
```

### Create User Mapping

```sql
INSERT INTO product_users (
    product_id,
    user_id,
    organization_id,
    external_user_id,
    external_user_email,
    is_active
) VALUES (
    (SELECT id FROM saas_products WHERE product_key = 'my-new-product'),
    (SELECT id FROM "User" WHERE email = 'user@example.com'),
    (SELECT id FROM "Organization" WHERE name = 'My Org'),
    'external_user_123',
    'user@example.com',
    true
);
```

### Add GCS Path Mapping

```sql
INSERT INTO user_gcs_mappings (
    product_user_id,
    user_id,
    organization_id,
    product_id,
    gcs_bucket_name,
    gcs_base_path,
    custom_path,
    path_type
) VALUES (
    (SELECT id FROM product_users WHERE external_user_id = 'external_user_123'),
    (SELECT id FROM "User" WHERE email = 'user@example.com'),
    (SELECT id FROM "Organization" WHERE name = 'My Org'),
    (SELECT id FROM saas_products WHERE product_key = 'my-new-product'),
    'my-product-bucket',
    'users/my-product',
    'user_123/uploads',
    'user'
);
```

## Common Queries

### Find All Media for a User Across Products

```sql
SELECT 
    sp.product_name,
    mr.external_file_name,
    mr.file_type,
    mr.file_size_bytes,
    ugm.full_gcs_path
FROM media_references mr
JOIN user_gcs_mappings ugm ON mr.user_gcs_mapping_id = ugm.id
JOIN saas_products sp ON mr.product_id = sp.id
JOIN "User" u ON mr.user_id = u.id
WHERE u.email = 'user@example.com'
  AND mr.deleted_at IS NULL
  AND mr.is_available = true
ORDER BY mr.created_at DESC;
```

### Get SSO Session Information

```sql
SELECT 
    pu.external_user_id,
    pu.external_user_email,
    pu.sso_session_id,
    pu.last_sso_login,
    sp.product_name,
    sp.sso_redirect_url
FROM product_users pu
JOIN saas_products sp ON pu.product_id = sp.id
WHERE pu.sso_session_id = 'session_id_here'
  AND pu.is_active = true
  AND pu.deleted_at IS NULL;
```

### Media Import Queue

```sql
SELECT 
    mr.external_file_name,
    mr.file_type,
    mr.import_priority,
    mr.import_status,
    sp.product_name,
    ugm.full_gcs_path
FROM media_references mr
JOIN saas_products sp ON mr.product_id = sp.id
JOIN user_gcs_mappings ugm ON mr.user_gcs_mapping_id = ugm.id
WHERE mr.auto_import = true
  AND mr.import_status IN ('pending', 'failed')
  AND mr.deleted_at IS NULL
ORDER BY mr.import_priority DESC, mr.created_at ASC;
```

## Security Considerations

1. **Data Isolation**: Each product's data is completely isolated through foreign key constraints
2. **Access Control**: Granular permissions per user-product combination
3. **Token Security**: SSO tokens are hashed, not stored in plain text
4. **Audit Trail**: All operations are tracked with timestamps
5. **Soft Deletes**: Data is never permanently deleted immediately

## Performance Notes

- All tables include comprehensive indexing for common query patterns
- JSONB fields use GIN indexes for efficient metadata queries
- Generated columns for computed paths reduce query complexity
- Partitioning can be added for large datasets in the future

## Maintenance

### Regular Tasks

1. **Clean up old SSO sessions**:
```sql
UPDATE product_users 
SET sso_session_id = NULL, sso_token_hash = NULL
WHERE last_sso_login < now() - interval '30 days';
```

2. **Update media sync status**:
```sql
-- Mark files as missing if they haven't been verified recently
UPDATE media_references 
SET sync_status = 'missing'
WHERE last_verified < now() - interval '7 days'
  AND sync_status = 'synced';
```

3. **Archive soft-deleted records**:
```sql
-- Example: Archive records deleted more than 90 days ago
-- (Implement according to your data retention policy)
```

## Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure User and Organization records exist before creating product_users
2. **Duplicate Path Errors**: Check for existing GCS path mappings before insertion
3. **Performance Issues**: Monitor query performance and add indexes as needed

### Debug Queries

```sql
-- Check for orphaned records
SELECT 'product_users' as table_name, COUNT(*) 
FROM product_users pu 
LEFT JOIN "User" u ON pu.user_id = u.id 
WHERE u.id IS NULL;

-- Verify index usage
EXPLAIN ANALYZE 
SELECT * FROM media_references 
WHERE user_id = 'some-uuid' AND file_type = 'image';
```

## Support

For issues or questions regarding these migrations:

1. Check the comments in each migration file
2. Review the verification queries in the sample data file
3. Monitor database logs for constraint violations
4. Test with sample data before applying to production

## License

These migrations are part of the Postiz project. Please refer to the main project license for usage terms.