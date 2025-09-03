-- Migration: 006 - Sample Data for Multi-Product SSO Integration
-- Description: Inserts sample data for testing the multi-product SSO system
-- Date: 2025-08-26
-- PostgreSQL Migration

-- This migration creates sample data for testing the SSO integration system
-- It includes sample products, users, GCS mappings, and media references

-- ============================================================================
-- Sample SaaS Products
-- ============================================================================

-- Insert sample SaaS products
INSERT INTO saas_products (
    id,
    product_key,
    product_name,
    product_description,
    base_url,
    api_key,
    sso_enabled,
    sso_redirect_url,
    allowed_domains,
    gcs_bucket_name,
    gcs_base_path,
    gcs_credentials_json,
    settings,
    auto_create_users,
    allow_media_upload,
    data_isolation_enabled,
    status
) VALUES 
-- Video Generation SaaS Product
(
    gen_random_uuid(),
    'video-generation',
    'AI Video Generation Platform',
    'Advanced AI-powered video generation and editing platform',
    'https://video-gen.example.com',
    'vg_api_key_12345',
    true,
    'https://video-gen.example.com/sso/postiz',
    ARRAY['video-gen.example.com', 'staging-video-gen.example.com'],
    'video-generation-media-bucket',
    'users/video-generation',
    '{"type": "service_account", "project_id": "video-gen-project"}',
    '{"max_video_length": 300, "supported_formats": ["mp4", "avi", "mov"], "ai_models": ["gpt-4-vision", "dall-e-3"]}'::jsonb,
    true,
    true,
    true,
    'active'
),
-- Shopify App Product
(
    gen_random_uuid(),
    'shopify-app',
    'Shopify Marketing Automation',
    'Comprehensive marketing automation for Shopify stores',
    'https://shopify-marketing.example.com',
    'sa_api_key_67890',
    true,
    'https://shopify-marketing.example.com/auth/postiz',
    ARRAY['shopify-marketing.example.com', 'app.shopify.com'],
    'shopify-marketing-assets',
    'stores',
    '{"type": "service_account", "project_id": "shopify-marketing-proj"}',
    '{"shopify_api_version": "2024-01", "webhook_endpoints": ["/webhooks/orders", "/webhooks/products"]}'::jsonb,
    true,
    true,
    true,
    'active'
),
-- Content Creator Platform
(
    gen_random_uuid(),
    'content-creator',
    'Content Creator Studio',
    'All-in-one content creation and management platform',
    'https://creator-studio.example.com',
    'cc_api_key_11111',
    true,
    'https://creator-studio.example.com/oauth/postiz',
    ARRAY['creator-studio.example.com'],
    'creator-content-bucket',
    'creators',
    '{"type": "service_account", "project_id": "content-creator-platform"}',
    '{"supported_content_types": ["image", "video", "audio", "text"], "collaboration_enabled": true}'::jsonb,
    true,
    true,
    true,
    'active'
);

-- ============================================================================
-- Sample Product Users (requires existing User and Organization records)
-- ============================================================================

-- Note: These INSERT statements assume that there are existing User and Organization records
-- In a real migration, you would either:
-- 1. Create sample users/orgs first, or
-- 2. Reference actual existing records, or
-- 3. Make these conditional based on existing data

-- Create sample organizations if they don't exist
INSERT INTO "Organization" (id, name, description, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Sample SSO Test Organization',
    'Test organization for multi-product SSO integration',
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM "Organization" WHERE name = 'Sample SSO Test Organization'
);

-- Create sample users if they don't exist
INSERT INTO "User" (id, email, "providerName", name, timezone, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'john.doe@example.com',
    'LOCAL'::public."Provider",
    'John Doe',
    0,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM "User" WHERE email = 'john.doe@example.com'
);

INSERT INTO "User" (id, email, "providerName", name, timezone, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'jane.smith@example.com',
    'LOCAL'::public."Provider",
    'Jane Smith',
    0,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM "User" WHERE email = 'jane.smith@example.com'
);

-- Create UserOrganization relationships
INSERT INTO "UserOrganization" (id, "userId", "organizationId", role, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    u.id,
    o.id,
    'ADMIN'::public."Role",
    now(),
    now()
FROM "User" u
CROSS JOIN "Organization" o
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com')
  AND o.name = 'Sample SSO Test Organization'
  AND NOT EXISTS (
    SELECT 1 FROM "UserOrganization" uo 
    WHERE uo."userId" = u.id AND uo."organizationId" = o.id
  );

-- Sample product users with realistic external IDs and paths
WITH sample_data AS (
    SELECT 
        sp.id as product_id,
        u.id as user_id,
        o.id as organization_id,
        sp.product_key,
        u.email,
        u.name
    FROM saas_products sp
    CROSS JOIN "User" u
    CROSS JOIN "Organization" o
    WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com')
      AND o.name = 'Sample SSO Test Organization'
      AND sp.product_key IN ('video-generation', 'shopify-app', 'content-creator')
)
INSERT INTO product_users (
    id,
    product_id,
    user_id,
    organization_id,
    external_user_id,
    external_user_email,
    external_user_name,
    external_user_metadata,
    sso_session_id,
    last_sso_login,
    preferences,
    permissions,
    is_active,
    data_access_level
)
SELECT 
    gen_random_uuid(),
    sd.product_id,
    sd.user_id,
    sd.organization_id,
    CASE 
        WHEN sd.product_key = 'video-generation' AND sd.email = 'john.doe@example.com' THEN 'K7mN9pQx2R'
        WHEN sd.product_key = 'video-generation' AND sd.email = 'jane.smith@example.com' THEN '62152016094'
        WHEN sd.product_key = 'shopify-app' AND sd.email = 'john.doe@example.com' THEN 'shop_user_12345'
        WHEN sd.product_key = 'shopify-app' AND sd.email = 'jane.smith@example.com' THEN 'shop_user_67890'
        WHEN sd.product_key = 'content-creator' AND sd.email = 'john.doe@example.com' THEN 'creator_001'
        WHEN sd.product_key = 'content-creator' AND sd.email = 'jane.smith@example.com' THEN 'creator_002'
    END as external_user_id,
    sd.email,
    sd.name,
    CASE 
        WHEN sd.product_key = 'video-generation' THEN '{"subscription": "premium", "ai_credits": 1000}'::jsonb
        WHEN sd.product_key = 'shopify-app' THEN '{"store_url": "example-store.myshopify.com", "plan": "advanced"}'::jsonb
        WHEN sd.product_key = 'content-creator' THEN '{"content_categories": ["lifestyle", "tech"], "follower_count": 5000}'::jsonb
    END,
    'sso_session_' || substr(md5(random()::text), 0, 16),
    now() - interval '1 hour',
    '{"theme": "dark", "notifications_enabled": true}'::jsonb,
    '{"can_upload": true, "can_delete": false, "admin": false}'::jsonb,
    true,
    'full'
FROM sample_data sd;

-- ============================================================================
-- Sample GCS Mappings
-- ============================================================================

INSERT INTO user_gcs_mappings (
    id,
    product_user_id,
    user_id,
    organization_id,
    product_id,
    gcs_bucket_name,
    gcs_base_path,
    custom_path,
    path_type,
    path_pattern,
    is_active,
    metadata,
    sync_settings
)
SELECT 
    gen_random_uuid(),
    pu.id,
    pu.user_id,
    pu.organization_id,
    pu.product_id,
    sp.gcs_bucket_name,
    sp.gcs_base_path,
    CASE 
        WHEN pu.external_user_id = 'K7mN9pQx2R' THEN 'K7mN9pQx2R-DEV/1'
        WHEN pu.external_user_id = '62152016094' THEN '62152016094'
        WHEN pu.external_user_id = 'shop_user_12345' THEN 'shop_12345/media'
        WHEN pu.external_user_id = 'shop_user_67890' THEN 'shop_67890/media'
        WHEN pu.external_user_id = 'creator_001' THEN 'creator_001/uploads'
        WHEN pu.external_user_id = 'creator_002' THEN 'creator_002/uploads'
        ELSE substr(md5(pu.external_user_id), 0, 9) -- fallback random path
    END,
    'user',
    CASE 
        WHEN pu.external_user_id LIKE '%-%' AND pu.external_user_id LIKE '%/%' THEN 'alphanumeric-dev'
        WHEN pu.external_user_id ~ '^[0-9]+$' THEN 'numeric-id'
        ELSE 'custom'
    END,
    true,
    '{"sync_frequency": "daily", "last_scan": null}'::jsonb,
    '{"auto_sync": true, "include_thumbnails": true, "file_types": ["jpg", "png", "mp4", "avi"]}'::jsonb
FROM product_users pu
JOIN saas_products sp ON pu.product_id = sp.id;

-- ============================================================================
-- Sample Media References
-- ============================================================================

INSERT INTO media_references (
    id,
    user_gcs_mapping_id,
    organization_id,
    product_id,
    user_id,
    external_file_path,
    external_file_name,
    external_file_hash,
    file_type,
    mime_type,
    file_size_bytes,
    file_extension,
    width,
    height,
    duration_seconds,
    alt_text,
    description,
    title,
    tags,
    metadata,
    is_available,
    sync_status,
    auto_import,
    import_priority,
    import_status,
    content_rating
)
SELECT 
    gen_random_uuid(),
    ugm.id,
    ugm.organization_id,
    ugm.product_id,
    ugm.user_id,
    ugm.full_gcs_path || '/' || 
        CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
            WHEN 0 THEN 'video_sample_01.mp4'
            WHEN 1 THEN 'product_image_' || (random() * 100)::int || '.jpg'
            ELSE 'thumbnail_' || (random() * 50)::int || '.png'
        END,
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN 'video_sample_01.mp4'
        WHEN 1 THEN 'product_image_' || (random() * 100)::int || '.jpg'
        ELSE 'thumbnail_' || (random() * 50)::int || '.png'
    END,
    encode(sha256(random()::text::bytea), 'hex'),
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN 'video'
        WHEN 1 THEN 'image'
        ELSE 'image'
    END,
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN 'video/mp4'
        WHEN 1 THEN 'image/jpeg'
        ELSE 'image/png'
    END,
    (random() * 10000000 + 100000)::bigint, -- Random file size between 100KB and 10MB
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN 'mp4'
        WHEN 1 THEN 'jpg'
        ELSE 'png'
    END,
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN null -- videos don't have width in this context
        WHEN 1 THEN (800 + random() * 1200)::int
        ELSE (400 + random() * 800)::int
    END,
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN null -- videos don't have height in this context
        WHEN 1 THEN (600 + random() * 900)::int
        ELSE (300 + random() * 600)::int
    END,
    CASE (row_number() OVER (PARTITION BY ugm.id ORDER BY random()))::int % 3
        WHEN 0 THEN (30 + random() * 300)::int -- video duration
        ELSE null
    END,
    'Sample media file for SSO testing',
    'This is a sample media file created for testing the multi-product SSO integration system.',
    'Sample Media File #' || generate_random_uuid()::text,
    CASE sp.product_key
        WHEN 'video-generation' THEN ARRAY['ai-generated', 'video', 'marketing']
        WHEN 'shopify-app' THEN ARRAY['product', 'ecommerce', 'catalog']
        WHEN 'content-creator' THEN ARRAY['content', 'social-media', 'creative']
        ELSE ARRAY['sample', 'test']
    END,
    CASE sp.product_key
        WHEN 'video-generation' THEN '{"ai_model": "gpt-4-vision", "generation_time": 45, "style": "professional"}'::jsonb
        WHEN 'shopify-app' THEN '{"product_id": "prod_12345", "category": "electronics", "price": 99.99}'::jsonb
        WHEN 'content-creator' THEN '{"engagement_rate": 0.05, "best_time_to_post": "18:00", "platform": "instagram"}'::jsonb
        ELSE '{}'::jsonb
    END,
    true,
    'synced',
    true,
    (random() * 10)::int,
    CASE (random() * 4)::int 
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'importing'
        WHEN 2 THEN 'imported'
        ELSE 'imported'
    END,
    'safe'
FROM user_gcs_mappings ugm
JOIN saas_products sp ON ugm.product_id = sp.id
CROSS JOIN generate_series(1, 3) -- Generate 3 sample files per mapping
WHERE ugm.is_active = true;

-- ============================================================================
-- Update Statistics
-- ============================================================================

-- Update usage statistics for GCS mappings
UPDATE user_gcs_mappings 
SET 
    total_files = (SELECT COUNT(*) FROM media_references mr WHERE mr.user_gcs_mapping_id = user_gcs_mappings.id),
    total_size_bytes = (SELECT COALESCE(SUM(file_size_bytes), 0) FROM media_references mr WHERE mr.user_gcs_mapping_id = user_gcs_mappings.id),
    access_count = (random() * 50)::bigint,
    last_accessed = now() - interval '1 hour' * (random() * 24)
WHERE id IN (SELECT id FROM user_gcs_mappings);

-- Update access statistics for media references
UPDATE media_references 
SET 
    access_count = (random() * 20)::bigint,
    first_accessed = created_at + interval '1 hour',
    last_accessed = now() - interval '1 hour' * (random() * 48)
WHERE id IN (SELECT id FROM media_references);

-- ============================================================================
-- Verification Queries (for testing)
-- ============================================================================

-- These are informational queries that can be run to verify the sample data
-- Comment them out if you don't want them in the migration

-- Count of records created
SELECT 
    'saas_products' as table_name, 
    COUNT(*) as record_count 
FROM saas_products WHERE product_key IN ('video-generation', 'shopify-app', 'content-creator')
UNION ALL
SELECT 
    'product_users' as table_name, 
    COUNT(*) as record_count 
FROM product_users pu 
JOIN saas_products sp ON pu.product_id = sp.id 
WHERE sp.product_key IN ('video-generation', 'shopify-app', 'content-creator')
UNION ALL
SELECT 
    'user_gcs_mappings' as table_name, 
    COUNT(*) as record_count 
FROM user_gcs_mappings ugm 
JOIN saas_products sp ON ugm.product_id = sp.id 
WHERE sp.product_key IN ('video-generation', 'shopify-app', 'content-creator')
UNION ALL
SELECT 
    'media_references' as table_name, 
    COUNT(*) as record_count 
FROM media_references mr 
JOIN saas_products sp ON mr.product_id = sp.id 
WHERE sp.product_key IN ('video-generation', 'shopify-app', 'content-creator');

-- Add comments
COMMENT ON TABLE saas_products IS 'Contains sample data for testing multi-product SSO integration';
COMMENT ON TABLE product_users IS 'Contains sample user mappings for testing SSO authentication';
COMMENT ON TABLE user_gcs_mappings IS 'Contains sample GCS path mappings with various pattern types';
COMMENT ON TABLE media_references IS 'Contains sample media references for testing file integration';