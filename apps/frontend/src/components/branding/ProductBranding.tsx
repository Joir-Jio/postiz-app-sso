'use client';

import { FC, ReactNode, useEffect, useMemo } from 'react';
import { ProductBranding as ProductBrandingType, BrandingComponentProps } from '@gitroom/frontend/types/branding';
import { brandingUtils, getBranding } from '@gitroom/frontend/utils/productBranding';

/**
 * Product Branding Component Props
 */
interface ProductBrandingProps extends BrandingComponentProps {
  /** Children to render with branding context */
  children: ReactNode;
  /** Whether to apply branding globally to document root */
  global?: boolean;
  /** Whether to show branding debug info */
  debug?: boolean;
}

/**
 * Product Branding Component
 * 
 * Applies dynamic product branding to its children by:
 * - Setting CSS variables for colors, typography, and theme
 * - Applying product-specific styling context
 * - Managing theme transitions and branding persistence
 * - Supporting both scoped and global branding application
 * - Providing fallback branding for unknown products
 */
export const ProductBranding: FC<ProductBrandingProps> = ({
  children,
  productKey,
  branding: brandingOverride,
  applyToChildren = true,
  global = false,
  debug = false,
  className = '',
  style = {},
}) => {
  // Get the effective branding configuration
  const effectiveBranding = useMemo(() => {
    let baseBranding: ProductBrandingType | null = null;
    
    if (productKey) {
      baseBranding = getBranding(productKey);
    }
    
    if (!baseBranding) {
      // Use default branding as fallback
      baseBranding = brandingUtils.getBranding('postiz') || {
        product: { key: 'unknown', name: 'Unknown Product' },
        colors: { primary: '#3B82F6' },
        theme: 'dark',
      } as ProductBrandingType;
    }
    
    // Merge with overrides if provided
    if (brandingOverride) {
      baseBranding = brandingUtils.mergeBranding(baseBranding, brandingOverride);
    }
    
    return baseBranding;
  }, [productKey, brandingOverride]);

  // Validate the branding configuration
  const validation = useMemo(() => {
    return brandingUtils.validateBranding(effectiveBranding);
  }, [effectiveBranding]);

  // Generate CSS variables and styles
  const brandingStyles = useMemo(() => {
    const { colors, typography } = effectiveBranding;
    const styles = { ...style } as Record<string, any>;
    
    // Apply color variables
    if (colors.primary) {
      styles['--brand-primary'] = colors.primary;
    }
    if (colors.secondary) {
      styles['--brand-secondary'] = colors.secondary;
    }
    if (colors.accent) {
      styles['--brand-accent'] = colors.accent;
    }
    if (colors.background) {
      styles['--brand-background'] = colors.background;
    }
    if (colors.textLight) {
      styles['--brand-text-light'] = colors.textLight;
    }
    if (colors.textDark) {
      styles['--brand-text-dark'] = colors.textDark;
    }
    if (colors.success) {
      styles['--brand-success'] = colors.success;
    }
    if (colors.warning) {
      styles['--brand-warning'] = colors.warning;
    }
    if (colors.error) {
      styles['--brand-error'] = colors.error;
    }
    
    // Apply typography variables
    if (typography?.fontFamily) {
      styles['--brand-font-family'] = typography.fontFamily;
    }
    if (typography?.headingFontFamily) {
      styles['--brand-heading-font'] = typography.headingFontFamily;
    }
    if (typography?.fontSize) {
      styles['--brand-font-size'] = typography.fontSize;
    }
    if (typography?.headingWeight) {
      styles['--brand-heading-weight'] = typography.headingWeight;
    }
    if (typography?.lineHeight) {
      styles['--brand-line-height'] = typography.lineHeight;
    }
    
    return styles as React.CSSProperties;
  }, [effectiveBranding, style]);

  // Apply global branding if requested
  useEffect(() => {
    if (global) {
      brandingUtils.applyCssVariables(effectiveBranding, document.documentElement);
      
      // Cleanup on unmount
      return () => {
        // Only remove if this component set the global branding
        // In a real implementation, you'd want to track this more carefully
      };
    }
  }, [effectiveBranding, global]);

  // Generate dynamic CSS classes
  const brandingClasses = useMemo(() => {
    const classes = [className];
    
    if (productKey) {
      classes.push(`product-${productKey}`);
      classes.push(`theme-${effectiveBranding.theme || 'dark'}`);
    }
    
    // Add validation status classes for debugging
    if (debug) {
      classes.push(validation.valid ? 'branding-valid' : 'branding-invalid');
    }
    
    return classes.filter(Boolean).join(' ');
  }, [productKey, effectiveBranding.theme, className, debug, validation.valid]);

  // Debug information
  const debugInfo = debug && (
    <div 
      className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-sm"
      style={{ fontFamily: 'monospace' }}
    >
      <div className="font-bold mb-2">🎨 Branding Debug</div>
      <div>Product: {effectiveBranding.product.key}</div>
      <div>Theme: {effectiveBranding.theme}</div>
      <div>Primary: {effectiveBranding.colors.primary}</div>
      <div>Valid: {validation.valid ? '✅' : '❌'}</div>
      {!validation.valid && (
        <div className="mt-2">
          <div className="text-red-400">Errors:</div>
          {validation.errors.map((error, i) => (
            <div key={i} className="text-red-300">• {error}</div>
          ))}
        </div>
      )}
    </div>
  );

  // Render with branding context
  if (applyToChildren) {
    return (
      <div 
        className={brandingClasses}
        style={brandingStyles}
        data-product={productKey}
        data-theme={effectiveBranding.theme}
      >
        {children}
        {debugInfo}
      </div>
    );
  }

  // Just render children without wrapper
  return (
    <>
      {children}
      {debugInfo}
    </>
  );
};