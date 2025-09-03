-- Migration: 004 - Create Media References Table
-- Description: Creates the media_references table for external file references without re-uploading
-- Date: 2025-08-26
-- PostgreSQL Migration

-- Create media_references table for external media file references
CREATE TABLE IF NOT EXISTS media_references (
    -- Primary key using UUID following Postiz convention
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key relationships
    user_gcs_mapping_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    -- Optional link to existing Postiz media record
    postiz_media_id UUID,
    
    -- External file identification
    external_file_path VARCHAR(2000) NOT NULL, -- Full GCS path to the file
    external_file_name VARCHAR(500) NOT NULL,
    external_file_hash VARCHAR(64), -- SHA-256 hash for deduplication
    
    -- File metadata
    file_type VARCHAR(50) NOT NULL, -- e.g., 'image', 'video', 'audio', 'document'
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    file_extension VARCHAR(10),
    
    -- Media-specific metadata
    width INTEGER, -- For images and videos
    height INTEGER, -- For images and videos
    duration_seconds INTEGER, -- For videos and audio
    
    -- Thumbnail information
    thumbnail_path VARCHAR(2000),
    thumbnail_timestamp INTEGER, -- For video thumbnails
    
    -- Content metadata
    alt_text VARCHAR(1000),
    description TEXT,
    title VARCHAR(500),
    tags TEXT[], -- Array of tags
    
    -- Technical metadata stored as JSONB for flexibility
    metadata JSONB DEFAULT '{}', -- EXIF data, video codecs, etc.
    
    -- Access and sync information
    is_available BOOLEAN NOT NULL DEFAULT true,
    last_verified TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'missing')),
    
    -- Usage tracking
    access_count BIGINT DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    first_accessed TIMESTAMP WITH TIME ZONE,
    
    -- Content classification and filtering
    content_rating VARCHAR(10) DEFAULT 'safe' CHECK (content_rating IN ('safe', 'adult', 'violence', 'questionable')),
    is_public BOOLEAN NOT NULL DEFAULT false,
    
    -- Postiz integration settings
    auto_import BOOLEAN NOT NULL DEFAULT true,
    import_priority INTEGER DEFAULT 0, -- Higher numbers = higher priority
    import_status VARCHAR(20) DEFAULT 'pending' CHECK (import_status IN ('pending', 'importing', 'imported', 'failed', 'skipped')),
    import_error_message TEXT,
    imported_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields following Postiz convention
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraints
    CONSTRAINT fk_media_references_user_gcs_mapping_id 
        FOREIGN KEY (user_gcs_mapping_id) REFERENCES user_gcs_mappings(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_references_organization_id 
        FOREIGN KEY (organization_id) REFERENCES "Organization"(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_references_product_id 
        FOREIGN KEY (product_id) REFERENCES saas_products(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_references_user_id 
        FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_media_references_postiz_media_id 
        FOREIGN KEY (postiz_media_id) REFERENCES "Media"(id) ON DELETE SET NULL
);

-- Create unique constraint to prevent duplicate file references
CREATE UNIQUE INDEX idx_media_references_unique_file 
ON media_references (user_gcs_mapping_id, external_file_path) 
WHERE deleted_at IS NULL;

-- Alternative unique constraint based on file hash for deduplication
CREATE UNIQUE INDEX idx_media_references_unique_hash 
ON media_references (user_gcs_mapping_id, external_file_hash) 
WHERE deleted_at IS NULL AND external_file_hash IS NOT NULL;

-- Create indexes for optimal performance
CREATE INDEX idx_media_references_user_gcs_mapping_id ON media_references (user_gcs_mapping_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_organization_id ON media_references (organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_product_id ON media_references (product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_user_id ON media_references (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_postiz_media_id ON media_references (postiz_media_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_file_name ON media_references (external_file_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_file_hash ON media_references (external_file_hash) WHERE deleted_at IS NULL AND external_file_hash IS NOT NULL;
CREATE INDEX idx_media_references_file_type ON media_references (file_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_mime_type ON media_references (mime_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_file_size ON media_references (file_size_bytes) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_is_available ON media_references (is_available) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_sync_status ON media_references (sync_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_import_status ON media_references (import_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_auto_import ON media_references (auto_import) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_is_public ON media_references (is_public) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_content_rating ON media_references (content_rating) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_last_accessed ON media_references (last_accessed) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_created_at ON media_references (created_at);
CREATE INDEX idx_media_references_updated_at ON media_references (updated_at);
CREATE INDEX idx_media_references_deleted_at ON media_references (deleted_at);

-- Composite indexes for common queries
CREATE INDEX idx_media_references_user_product_type 
ON media_references (user_id, product_id, file_type) WHERE deleted_at IS NULL;

CREATE INDEX idx_media_references_org_available_type 
ON media_references (organization_id, is_available, file_type) WHERE deleted_at IS NULL;

CREATE INDEX idx_media_references_import_priority 
ON media_references (auto_import, import_priority DESC, import_status) WHERE deleted_at IS NULL;

CREATE INDEX idx_media_references_sync_available 
ON media_references (sync_status, is_available) WHERE deleted_at IS NULL;

-- GIN indexes for arrays and JSONB
CREATE INDEX idx_media_references_tags ON media_references USING GIN (tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_references_metadata ON media_references USING GIN (metadata) WHERE deleted_at IS NULL;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_media_references_updated_at
    BEFORE UPDATE ON media_references
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update access tracking
CREATE OR REPLACE FUNCTION update_media_access_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Update access tracking when access_count increases
    IF NEW.access_count > OLD.access_count THEN
        NEW.last_accessed = now();
        -- Set first_accessed if this is the first access
        IF OLD.first_accessed IS NULL THEN
            NEW.first_accessed = now();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_references_access_tracking
    BEFORE UPDATE OF access_count ON media_references
    FOR EACH ROW
    EXECUTE FUNCTION update_media_access_tracking();

-- Create trigger to update import timestamp
CREATE OR REPLACE FUNCTION update_import_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Update imported_at when import_status changes to 'imported'
    IF NEW.import_status = 'imported' AND OLD.import_status != 'imported' THEN
        NEW.imported_at = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_references_import_timestamp
    BEFORE UPDATE OF import_status ON media_references
    FOR EACH ROW
    EXECUTE FUNCTION update_import_timestamp();

-- Add comments for documentation
COMMENT ON TABLE media_references IS 'References to external media files in GCS buckets without re-uploading to Postiz';
COMMENT ON COLUMN media_references.external_file_path IS 'Full GCS path to the external media file';
COMMENT ON COLUMN media_references.external_file_hash IS 'SHA-256 hash for file deduplication and integrity checking';
COMMENT ON COLUMN media_references.postiz_media_id IS 'Reference to existing Postiz media record if imported';
COMMENT ON COLUMN media_references.metadata IS 'Technical metadata (EXIF, video codecs, etc.) stored as JSONB';
COMMENT ON COLUMN media_references.sync_status IS 'Status of file synchronization from external source';
COMMENT ON COLUMN media_references.import_status IS 'Status of importing this reference into Postiz media system';
COMMENT ON COLUMN media_references.auto_import IS 'Whether this media should be automatically imported to Postiz';
COMMENT ON COLUMN media_references.import_priority IS 'Priority for import queue (higher numbers = higher priority)';
COMMENT ON COLUMN media_references.content_rating IS 'Content safety rating for filtering purposes';
COMMENT ON COLUMN media_references.tags IS 'Array of tags associated with this media file';
COMMENT ON COLUMN media_references.access_count IS 'Number of times this media reference has been accessed';
COMMENT ON COLUMN media_references.first_accessed IS 'Timestamp of first access to this media reference';
COMMENT ON COLUMN media_references.last_accessed IS 'Timestamp of most recent access to this media reference';