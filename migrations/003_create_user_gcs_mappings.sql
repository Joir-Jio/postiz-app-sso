-- Migration: 003 - Create User GCS Mappings Table
-- Description: Creates the user_gcs_mappings table for GCS path mapping with custom paths
-- Date: 2025-08-26
-- PostgreSQL Migration

-- Create user_gcs_mappings table for GCS path mapping
CREATE TABLE IF NOT EXISTS user_gcs_mappings (
    -- Primary key using UUID following Postiz convention
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key relationships
    product_user_id UUID NOT NULL,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    product_id UUID NOT NULL,
    
    -- GCS path mapping fields
    gcs_bucket_name VARCHAR(255) NOT NULL,
    gcs_base_path VARCHAR(1000) NOT NULL, -- Base path in GCS bucket
    custom_path VARCHAR(1000), -- Custom path segment (e.g., "K7mN9pQx2R-DEV/1", "62152016094", "9")
    full_gcs_path VARCHAR(2000) GENERATED ALWAYS AS (
        CASE 
            WHEN custom_path IS NOT NULL AND custom_path != '' 
            THEN CONCAT(gcs_base_path, '/', custom_path)
            ELSE gcs_base_path
        END
    ) STORED,
    
    -- Path validation and metadata
    path_type VARCHAR(50) DEFAULT 'user' CHECK (path_type IN ('user', 'organization', 'product', 'custom')),
    path_pattern VARCHAR(100), -- Pattern identifier for path generation (e.g., 'alphanumeric-dev', 'numeric-id', 'simple-numeric')
    
    -- Access control and permissions
    is_active BOOLEAN NOT NULL DEFAULT true,
    read_access BOOLEAN NOT NULL DEFAULT true,
    write_access BOOLEAN NOT NULL DEFAULT true,
    delete_access BOOLEAN NOT NULL DEFAULT false,
    
    -- Path metadata and settings
    metadata JSONB DEFAULT '{}', -- Additional metadata about the path
    sync_settings JSONB DEFAULT '{}', -- Sync preferences and settings
    
    -- Usage tracking
    last_accessed TIMESTAMP WITH TIME ZONE,
    access_count BIGINT DEFAULT 0,
    total_files INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    
    -- Audit fields following Postiz convention
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraints
    CONSTRAINT fk_user_gcs_mappings_product_user_id 
        FOREIGN KEY (product_user_id) REFERENCES product_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_gcs_mappings_user_id 
        FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_gcs_mappings_organization_id 
        FOREIGN KEY (organization_id) REFERENCES "Organization"(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_gcs_mappings_product_id 
        FOREIGN KEY (product_id) REFERENCES saas_products(id) ON DELETE CASCADE
);

-- Create unique constraint to prevent duplicate mappings
CREATE UNIQUE INDEX idx_user_gcs_mappings_unique_active 
ON user_gcs_mappings (product_user_id, gcs_bucket_name, gcs_base_path, custom_path) 
WHERE deleted_at IS NULL;

-- Alternative unique constraint for cases where custom_path is null
CREATE UNIQUE INDEX idx_user_gcs_mappings_unique_base_path 
ON user_gcs_mappings (product_user_id, gcs_bucket_name, gcs_base_path) 
WHERE deleted_at IS NULL AND custom_path IS NULL;

-- Create indexes for optimal performance
CREATE INDEX idx_user_gcs_mappings_product_user_id ON user_gcs_mappings (product_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_user_id ON user_gcs_mappings (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_organization_id ON user_gcs_mappings (organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_product_id ON user_gcs_mappings (product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_bucket ON user_gcs_mappings (gcs_bucket_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_base_path ON user_gcs_mappings (gcs_base_path) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_custom_path ON user_gcs_mappings (custom_path) WHERE deleted_at IS NULL AND custom_path IS NOT NULL;
CREATE INDEX idx_user_gcs_mappings_full_path ON user_gcs_mappings (full_gcs_path) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_path_type ON user_gcs_mappings (path_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_is_active ON user_gcs_mappings (is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_last_accessed ON user_gcs_mappings (last_accessed) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_gcs_mappings_created_at ON user_gcs_mappings (created_at);
CREATE INDEX idx_user_gcs_mappings_updated_at ON user_gcs_mappings (updated_at);
CREATE INDEX idx_user_gcs_mappings_deleted_at ON user_gcs_mappings (deleted_at);

-- Composite indexes for common queries
CREATE INDEX idx_user_gcs_mappings_user_product 
ON user_gcs_mappings (user_id, product_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_user_gcs_mappings_active_access 
ON user_gcs_mappings (is_active, read_access, write_access) WHERE deleted_at IS NULL;

CREATE INDEX idx_user_gcs_mappings_bucket_active 
ON user_gcs_mappings (gcs_bucket_name, is_active) WHERE deleted_at IS NULL;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_user_gcs_mappings_updated_at
    BEFORE UPDATE ON user_gcs_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update last_accessed when access_count changes
CREATE OR REPLACE FUNCTION update_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update last_accessed if access_count has increased
    IF NEW.access_count > OLD.access_count THEN
        NEW.last_accessed = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_gcs_mappings_last_accessed
    BEFORE UPDATE OF access_count ON user_gcs_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_last_accessed();

-- Add comments for documentation
COMMENT ON TABLE user_gcs_mappings IS 'Maps users to their GCS storage paths for seamless media access across products';
COMMENT ON COLUMN user_gcs_mappings.gcs_bucket_name IS 'Name of the GCS bucket containing user media';
COMMENT ON COLUMN user_gcs_mappings.gcs_base_path IS 'Base path in the GCS bucket (e.g., users/video-generation)';
COMMENT ON COLUMN user_gcs_mappings.custom_path IS 'Custom path segment specific to user (e.g., K7mN9pQx2R-DEV/1, 62152016094, 9)';
COMMENT ON COLUMN user_gcs_mappings.full_gcs_path IS 'Generated full path combining base_path and custom_path';
COMMENT ON COLUMN user_gcs_mappings.path_type IS 'Type of path mapping (user, organization, product, custom)';
COMMENT ON COLUMN user_gcs_mappings.path_pattern IS 'Pattern identifier used for generating custom paths';
COMMENT ON COLUMN user_gcs_mappings.metadata IS 'Additional metadata about the GCS path mapping';
COMMENT ON COLUMN user_gcs_mappings.sync_settings IS 'Synchronization preferences and settings';
COMMENT ON COLUMN user_gcs_mappings.access_count IS 'Number of times this path mapping has been accessed';
COMMENT ON COLUMN user_gcs_mappings.total_files IS 'Total number of files in this GCS path';
COMMENT ON COLUMN user_gcs_mappings.total_size_bytes IS 'Total size in bytes of all files in this GCS path';