-- Migration: 001 - Create SaaS Products Table
-- Description: Creates the saas_products table for multi-product SSO integration
-- Date: 2025-08-26
-- PostgreSQL Migration

-- Create saas_products table for product registration and configuration
CREATE TABLE IF NOT EXISTS saas_products (
    -- Primary key using UUID following Postiz convention
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Product identification
    product_key VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    
    -- Product configuration
    base_url VARCHAR(500) NOT NULL,
    api_key VARCHAR(255),
    webhook_secret VARCHAR(255),
    
    -- SSO configuration
    sso_enabled BOOLEAN NOT NULL DEFAULT true,
    sso_redirect_url VARCHAR(500),
    allowed_domains TEXT[], -- Array of allowed domains for this product
    
    -- GCS configuration for media handling
    gcs_bucket_name VARCHAR(255),
    gcs_base_path VARCHAR(500),
    gcs_credentials_json JSONB,
    
    -- Product settings and metadata
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Feature flags
    auto_create_users BOOLEAN NOT NULL DEFAULT true,
    allow_media_upload BOOLEAN NOT NULL DEFAULT true,
    data_isolation_enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Status and lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- Audit fields following Postiz convention
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for optimal performance
CREATE INDEX idx_saas_products_product_key ON saas_products (product_key) WHERE deleted_at IS NULL;
CREATE INDEX idx_saas_products_status ON saas_products (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_saas_products_sso_enabled ON saas_products (sso_enabled) WHERE deleted_at IS NULL;
CREATE INDEX idx_saas_products_created_at ON saas_products (created_at);
CREATE INDEX idx_saas_products_updated_at ON saas_products (updated_at);
CREATE INDEX idx_saas_products_deleted_at ON saas_products (deleted_at);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saas_products_updated_at
    BEFORE UPDATE ON saas_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE saas_products IS 'Registry of SaaS products that can integrate with Postiz via SSO';
COMMENT ON COLUMN saas_products.product_key IS 'Unique identifier for the product (e.g., video-generation, shopify-app)';
COMMENT ON COLUMN saas_products.allowed_domains IS 'Array of domains allowed to authenticate users for this product';
COMMENT ON COLUMN saas_products.gcs_credentials_json IS 'JSON credentials for accessing GCS bucket for this product';
COMMENT ON COLUMN saas_products.settings IS 'Product-specific configuration settings';
COMMENT ON COLUMN saas_products.metadata IS 'Additional metadata for the product';
COMMENT ON COLUMN saas_products.data_isolation_enabled IS 'Whether to enforce data isolation between products';