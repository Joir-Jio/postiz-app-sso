'use client';

import { FC, useState, useMemo } from 'react';
import Image from 'next/image';
import { ProductBranding, ProductLogo as ProductLogoType } from '@gitroom/frontend/types/branding';
import { getBranding } from '@gitroom/frontend/utils/productBranding';

/**
 * Product Logo Component Props
 */
interface ProductLogoProps {
  /** Product key to get logo for */
  productKey?: string;
  /** Direct logo configuration */
  logo?: ProductLogoType;
  /** Size of the logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Logo variant */
  variant?: 'default' | 'dark' | 'icon' | 'wordmark';
  /** Whether the logo is in a dark context */
  darkContext?: boolean;
  /** Fallback to text if logo fails */
  showFallback?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether the logo should be clickable */
  clickable?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Product Logo Component
 * 
 * Displays product logos with:
 * - Automatic fallback handling for broken/missing images
 * - Responsive sizing with predefined size scales
 * - Support for different logo variants (main, dark, icon)
 * - Context-aware logo selection (dark/light backgrounds)
 * - Accessibility features and proper alt text
 * - Loading states and error handling
 * - Text fallback with branded styling
 */
export const ProductLogo: FC<ProductLogoProps> = ({
  productKey,
  logo: directLogo,
  size = 'md',
  variant = 'default',
  darkContext = false,
  showFallback = true,
  className = '',
  style = {},
  onClick,
  clickable = false,
  loading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get effective logo configuration
  const effectiveLogo = useMemo(() => {
    if (directLogo) return directLogo;
    
    if (productKey) {
      const branding = getBranding(productKey);
      return branding?.logo;
    }
    
    return null;
  }, [directLogo, productKey]);

  // Get product information for fallback
  const productInfo = useMemo(() => {
    if (productKey) {
      const branding = getBranding(productKey);
      return branding?.product;
    }
    return null;
  }, [productKey]);

  // Determine logo URL based on variant and context
  const logoUrl = useMemo(() => {
    if (!effectiveLogo) return null;
    
    switch (variant) {
      case 'dark':
        return effectiveLogo.darkUrl || effectiveLogo.url;
      case 'icon':
        return effectiveLogo.iconUrl || effectiveLogo.url;
      case 'default':
      case 'wordmark':
      default:
        // Use dark variant if in dark context and available
        if (darkContext && effectiveLogo.darkUrl) {
          return effectiveLogo.darkUrl;
        }
        return effectiveLogo.url;
    }
  }, [effectiveLogo, variant, darkContext]);

  // Size mappings
  const sizeMap = {
    xs: { width: 16, height: 16 },
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  };

  // Get effective size
  const effectiveSize = useMemo(() => {
    if (typeof size === 'number') {
      return { width: size, height: size };
    }
    return sizeMap[size];
  }, [size]);

  // Override with logo-specific dimensions if available
  const finalSize = useMemo(() => {
    if (effectiveLogo?.width && effectiveLogo?.height) {
      // Maintain aspect ratio while fitting within the requested size
      const aspectRatio = effectiveLogo.width / effectiveLogo.height;
      const maxSize = Math.max(effectiveSize.width, effectiveSize.height);
      
      if (aspectRatio > 1) {
        // Wider than tall
        return {
          width: maxSize,
          height: Math.round(maxSize / aspectRatio),
        };
      } else {
        // Taller than wide or square
        return {
          width: Math.round(maxSize * aspectRatio),
          height: maxSize,
        };
      }
    }
    
    return effectiveSize;
  }, [effectiveLogo, effectiveSize]);

  // Generate fallback text
  const fallbackText = useMemo(() => {
    if (productInfo?.name) {
      // Use first letter of each word, max 3 characters
      return productInfo.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);
    }
    
    if (productKey) {
      // Use first letter of product key
      return productKey.charAt(0).toUpperCase();
    }
    
    return '?';
  }, [productInfo, productKey]);

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Handle click
  const handleClick = () => {
    if ((clickable || onClick) && onClick) {
      onClick();
    }
  };

  // Common props for container
  const containerProps = {
    className: `inline-flex items-center justify-center ${
      clickable || onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
    } ${className}`,
    style: {
      ...style,
      width: finalSize.width,
      height: finalSize.height,
    },
    onClick: handleClick,
  };

  // Loading state
  if (loading || (logoUrl && imageLoading && !imageError)) {
    return (
      <div {...containerProps}>
        <div className="animate-pulse bg-gray-300 rounded-full w-full h-full flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show logo image if available and not errored
  if (logoUrl && !imageError) {
    return (
      <div {...containerProps}>
        <Image
          src={logoUrl}
          alt={effectiveLogo?.alt || `${productInfo?.name || productKey || 'Product'} logo`}
          width={finalSize.width}
          height={finalSize.height}
          className="object-contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={size === 'lg' || size === 'xl'}
        />
      </div>
    );
  }

  // Show text fallback if enabled
  if (showFallback) {
    // Dynamic font size based on container size
    const fontSize = Math.max(10, Math.min(finalSize.width * 0.4, finalSize.height * 0.4));
    
    return (
      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          backgroundColor: 'var(--brand-primary, #3B82F6)',
          color: 'var(--brand-text-dark, #FFFFFF)',
          borderRadius: '8px',
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          fontFamily: 'var(--brand-heading-font, inherit)',
        }}
        title={productInfo?.name || productKey}
      >
        {fallbackText}
      </div>
    );
  }

  // Empty state
  return (
    <div
      {...containerProps}
      style={{
        ...containerProps.style,
        backgroundColor: 'var(--gray-200, #E5E7EB)',
        borderRadius: '8px',
      }}
    >
      <svg
        width={finalSize.width * 0.6}
        height={finalSize.height * 0.6}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-gray-400"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </div>
  );
};

/**
 * Preset Logo Sizes Component
 */
export const LogoSizes = {
  Icon: (props: Omit<ProductLogoProps, 'size' | 'variant'>) => (
    <ProductLogo {...props} size="sm" variant="icon" />
  ),
  
  Small: (props: Omit<ProductLogoProps, 'size'>) => (
    <ProductLogo {...props} size="sm" />
  ),
  
  Medium: (props: Omit<ProductLogoProps, 'size'>) => (
    <ProductLogo {...props} size="md" />
  ),
  
  Large: (props: Omit<ProductLogoProps, 'size'>) => (
    <ProductLogo {...props} size="lg" />
  ),
  
  Hero: (props: Omit<ProductLogoProps, 'size'>) => (
    <ProductLogo {...props} size="xl" />
  ),
};

export default ProductLogo;