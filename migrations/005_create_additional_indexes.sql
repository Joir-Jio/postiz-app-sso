-- Migration: 005 - Additional Indexes and Performance Optimizations
-- Description: Creates additional indexes and optimizations for multi-product SSO system
-- Date: 2025-08-26
-- PostgreSQL Migration

-- Additional performance indexes for cross-table queries and common use cases

-- ============================================================================
-- Cross-table query optimizations
-- ============================================================================

-- Index for finding all media references for a specific user across all products
CREATE INDEX idx_cross_user_media_all_products 
ON media_references (user_id, is_available, file_type) 
WHERE deleted_at IS NULL;

-- Index for finding all users and their media for a specific product
CREATE INDEX idx_cross_product_users_media 
ON product_users (product_id, is_active, user_id) 
WHERE deleted_at IS NULL;

-- Index for organization-wide queries across products
CREATE INDEX idx_cross_org_product_users 
ON product_users (organization_id, product_id, is_active) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- SSO and authentication optimizations
-- ============================================================================

-- Composite index for SSO session lookups
CREATE INDEX idx_sso_session_lookup 
ON product_users (sso_session_id, last_sso_login DESC) 
WHERE deleted_at IS NULL AND sso_session_id IS NOT NULL AND is_active = true;

-- Index for external user authentication
CREATE INDEX idx_external_user_auth 
ON product_users (external_user_email, product_id, is_active) 
WHERE deleted_at IS NULL;

-- Index for token hash verification
CREATE INDEX idx_sso_token_verification 
ON product_users (sso_token_hash) 
WHERE deleted_at IS NULL AND sso_token_hash IS NOT NULL;

-- ============================================================================
-- Media sync and import optimizations
-- ============================================================================

-- Index for media import queue processing
CREATE INDEX idx_media_import_queue 
ON media_references (auto_import, import_status, import_priority DESC, created_at ASC) 
WHERE deleted_at IS NULL AND auto_import = true;

-- Index for sync status monitoring
CREATE INDEX idx_media_sync_monitoring 
ON media_references (sync_status, last_verified ASC) 
WHERE deleted_at IS NULL;

-- Index for failed imports that need retry
CREATE INDEX idx_media_failed_imports 
ON media_references (import_status, updated_at DESC) 
WHERE deleted_at IS NULL AND import_status = 'failed';

-- ============================================================================
-- GCS path and file management optimizations
-- ============================================================================

-- Index for GCS path prefix searches
CREATE INDEX idx_gcs_path_prefix 
ON user_gcs_mappings (gcs_bucket_name, gcs_base_path text_pattern_ops) 
WHERE deleted_at IS NULL;

-- Index for custom path pattern searches
CREATE INDEX idx_gcs_custom_path_pattern 
ON user_gcs_mappings (path_pattern, custom_path text_pattern_ops) 
WHERE deleted_at IS NULL AND custom_path IS NOT NULL;

-- Index for file path searches in media references
CREATE INDEX idx_media_file_path_prefix 
ON media_references (external_file_path text_pattern_ops) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- Analytics and reporting optimizations
-- ============================================================================

-- Index for usage analytics
CREATE INDEX idx_user_gcs_usage_stats 
ON user_gcs_mappings (product_id, access_count DESC, total_size_bytes DESC) 
WHERE deleted_at IS NULL;

-- Index for media access analytics
CREATE INDEX idx_media_access_stats 
ON media_references (product_id, file_type, access_count DESC, last_accessed DESC) 
WHERE deleted_at IS NULL;

-- Index for product activity monitoring
CREATE INDEX idx_product_activity 
ON product_users (product_id, last_sso_login DESC, is_active) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- Data cleanup and maintenance optimizations
-- ============================================================================

-- Index for finding stale SSO sessions
CREATE INDEX idx_stale_sso_sessions 
ON product_users (last_sso_login ASC) 
WHERE deleted_at IS NULL AND sso_session_id IS NOT NULL;

-- Index for finding orphaned media references
CREATE INDEX idx_orphaned_media_check 
ON media_references (user_gcs_mapping_id, is_available) 
WHERE deleted_at IS NULL;

-- Index for soft-deleted records cleanup
CREATE INDEX idx_soft_deleted_cleanup_saas_products ON saas_products (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_soft_deleted_cleanup_product_users ON product_users (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_soft_deleted_cleanup_user_gcs_mappings ON user_gcs_mappings (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_soft_deleted_cleanup_media_references ON media_references (deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- Product-specific feature indexes
-- ============================================================================

-- Index for product feature flags and settings queries
CREATE INDEX idx_product_features 
ON saas_products (status, sso_enabled, auto_create_users) 
WHERE deleted_at IS NULL;

-- Index for data isolation queries
CREATE INDEX idx_data_isolation 
ON saas_products (data_isolation_enabled, status) 
WHERE deleted_at IS NULL;

-- Index for media upload permissions
CREATE INDEX idx_media_upload_permissions 
ON saas_products (allow_media_upload, status) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- Full-text search preparation (if needed in the future)
-- ============================================================================

-- GIN index for product metadata search
CREATE INDEX idx_product_metadata_search 
ON saas_products USING GIN (metadata) 
WHERE deleted_at IS NULL;

-- GIN index for user preferences search
CREATE INDEX idx_user_preferences_search 
ON product_users USING GIN (preferences) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- Statistics and maintenance
-- ============================================================================

-- Update table statistics for better query planning
ANALYZE saas_products;
ANALYZE product_users;
ANALYZE user_gcs_mappings;
ANALYZE media_references;

-- Add comments for index documentation
COMMENT ON INDEX idx_cross_user_media_all_products IS 'Optimizes queries for user media across all products';
COMMENT ON INDEX idx_sso_session_lookup IS 'Optimizes SSO session validation and lookup';
COMMENT ON INDEX idx_media_import_queue IS 'Optimizes media import queue processing';
COMMENT ON INDEX idx_gcs_path_prefix IS 'Optimizes GCS path prefix searches for file discovery';
COMMENT ON INDEX idx_user_gcs_usage_stats IS 'Optimizes usage analytics and reporting queries';
COMMENT ON INDEX idx_stale_sso_sessions IS 'Optimizes cleanup of expired SSO sessions';
COMMENT ON INDEX idx_product_features IS 'Optimizes product feature flag queries';