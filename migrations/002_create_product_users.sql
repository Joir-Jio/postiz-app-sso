-- Migration: 002 - Create Product Users Table
-- Description: Creates the product_users table for mapping users between products and Postiz
-- Date: 2025-08-26
-- PostgreSQL Migration

-- Create product_users table for user mapping between products and Postiz
CREATE TABLE IF NOT EXISTS product_users (
    -- Primary key using UUID following Postiz convention
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key relationships
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    
    -- External product user identification
    external_user_id VARCHAR(255) NOT NULL,
    external_user_email VARCHAR(320) NOT NULL,
    external_user_name VARCHAR(255),
    external_user_metadata JSONB DEFAULT '{}',
    
    -- SSO session management
    sso_session_id VARCHAR(255),
    last_sso_login TIMESTAMP WITH TIME ZONE,
    sso_token_hash VARCHAR(255), -- Hash of the SSO token for verification
    
    -- User preferences specific to product integration
    preferences JSONB DEFAULT '{}',
    
    -- Access control
    permissions JSONB DEFAULT '{}', -- Product-specific permissions
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Data isolation settings
    data_access_level VARCHAR(20) NOT NULL DEFAULT 'full' CHECK (data_access_level IN ('full', 'limited', 'read-only')),
    
    -- Audit fields following Postiz convention
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraints
    CONSTRAINT fk_product_users_product_id 
        FOREIGN KEY (product_id) REFERENCES saas_products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_users_user_id 
        FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_users_organization_id 
        FOREIGN KEY (organization_id) REFERENCES "Organization"(id) ON DELETE CASCADE
);

-- Create unique constraint to prevent duplicate product-user mappings
ALTER TABLE product_users 
ADD CONSTRAINT uq_product_users_product_external_user 
UNIQUE (product_id, external_user_id, deleted_at);

-- Create composite unique constraint for active users
CREATE UNIQUE INDEX idx_product_users_unique_active 
ON product_users (product_id, external_user_id) 
WHERE deleted_at IS NULL;

-- Create indexes for optimal performance
CREATE INDEX idx_product_users_product_id ON product_users (product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_user_id ON product_users (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_organization_id ON product_users (organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_external_user_id ON product_users (external_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_external_user_email ON product_users (external_user_email) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_sso_session_id ON product_users (sso_session_id) WHERE deleted_at IS NULL AND sso_session_id IS NOT NULL;
CREATE INDEX idx_product_users_last_sso_login ON product_users (last_sso_login) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_is_active ON product_users (is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_users_created_at ON product_users (created_at);
CREATE INDEX idx_product_users_updated_at ON product_users (updated_at);
CREATE INDEX idx_product_users_deleted_at ON product_users (deleted_at);

-- Composite indexes for common queries
CREATE INDEX idx_product_users_product_user_org 
ON product_users (product_id, user_id, organization_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_product_users_external_active 
ON product_users (external_user_id, is_active) WHERE deleted_at IS NULL;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_product_users_updated_at
    BEFORE UPDATE ON product_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE product_users IS 'Mapping table between external product users and Postiz users for SSO integration';
COMMENT ON COLUMN product_users.external_user_id IS 'User identifier from the external SaaS product';
COMMENT ON COLUMN product_users.external_user_email IS 'Email address from the external SaaS product';
COMMENT ON COLUMN product_users.external_user_metadata IS 'Additional user data from the external product';
COMMENT ON COLUMN product_users.sso_session_id IS 'Current SSO session identifier for this user-product combination';
COMMENT ON COLUMN product_users.sso_token_hash IS 'Hash of the SSO token for secure verification';
COMMENT ON COLUMN product_users.preferences IS 'User preferences specific to this product integration';
COMMENT ON COLUMN product_users.permissions IS 'Product-specific permissions for this user';
COMMENT ON COLUMN product_users.data_access_level IS 'Level of data access granted to this user for this product';