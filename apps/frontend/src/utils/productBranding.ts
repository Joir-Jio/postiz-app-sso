/**
 * Product Branding Utilities
 * 
 * Utility functions for managing dynamic product branding in the SSO system.
 * Handles color manipulation, CSS generation, branding validation, and theme management.
 */

import { 
  ProductBranding, 
  ProductColorScheme, 
  BrandingUtils, 
  DEFAULT_BRANDING, 
  PRODUCT_BRANDING_PRESETS,
  BrandingContext
} from '@gitroom/frontend/types/branding';

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove hash if present
  hex = hex.replace('#', '');
  
  // Handle 3-character hex codes
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Validate hex format
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null;
  }
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return { r, g, b };
}

/**
 * Convert RGB values to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate luminance of a color
 */
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // Convert RGB to linear RGB
  const linearRgb = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance
  return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

/**
 * Check if a color is considered light
 */
export function isLightColor(color: string): boolean {
  return getLuminance(color) > 0.5;
}

/**
 * Get contrast-safe text color for a background color
 */
export function getContrastColor(
  backgroundColor: string, 
  lightColor: string = '#000000', 
  darkColor: string = '#FFFFFF'
): string {
  return isLightColor(backgroundColor) ? lightColor : darkColor;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(color: string, percent: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const amount = Math.round(255 * (percent / 100));
  
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(color: string, percent: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const amount = Math.round(255 * (percent / 100));
  
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

/**
 * Generate color variations for a base color
 */
export function generateColorVariations(baseColor: string): {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
} {
  return {
    50: lightenColor(baseColor, 45),
    100: lightenColor(baseColor, 35),
    200: lightenColor(baseColor, 25),
    300: lightenColor(baseColor, 15),
    400: lightenColor(baseColor, 8),
    500: baseColor,
    600: darkenColor(baseColor, 8),
    700: darkenColor(baseColor, 15),
    800: darkenColor(baseColor, 25),
    900: darkenColor(baseColor, 35),
  };
}

/**
 * Get branding for a specific product
 */
export function getBranding(productKey: string): ProductBranding | null {
  if (!productKey) return null;
  
  // Check presets first
  if (PRODUCT_BRANDING_PRESETS[productKey]) {
    return PRODUCT_BRANDING_PRESETS[productKey];
  }
  
  // Fallback to generating basic branding
  return generateBasicBranding(productKey);
}

/**
 * Generate basic branding for unknown products
 */
export function generateBasicBranding(productKey: string): ProductBranding {
  // Generate a color based on product key hash
  const hash = Array.from(productKey).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  const primary = `hsl(${hue}, 70%, 50%)`;
  
  // Convert HSL to hex for consistency
  const tempDiv = document.createElement('div');
  tempDiv.style.color = primary;
  document.body.appendChild(tempDiv);
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  
  // Extract RGB from computed color and convert to hex
  const rgbMatch = computedColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
  const primaryHex = rgbMatch 
    ? rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]))
    : '#3B82F6';
  
  return {
    product: {
      key: productKey,
      name: productKey.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `External Product: ${productKey}`,
    },
    colors: {
      primary: primaryHex,
      secondary: lightenColor(primaryHex, 15),
      accent: darkenColor(primaryHex, 10),
      background: '#111827',
      textLight: '#000000',
      textDark: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'dark',
  };
}

/**
 * Merge branding configurations
 */
export function mergeBranding(base: ProductBranding, override: Partial<ProductBranding>): ProductBranding {
  return {
    product: { ...base.product, ...override.product },
    colors: { ...base.colors, ...override.colors },
    logo: override.logo || base.logo,
    typography: { ...base.typography, ...override.typography },
    customCss: { ...base.customCss, ...override.customCss },
    theme: override.theme || base.theme,
  };
}

/**
 * Validate branding configuration
 */
export function validateBranding(branding: Partial<ProductBranding>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate product info
  if (!branding.product?.key) {
    errors.push('Product key is required');
  }
  
  if (!branding.product?.name) {
    errors.push('Product name is required');
  }
  
  // Validate colors
  if (branding.colors) {
    const { colors } = branding;
    
    if (colors.primary && !hexToRgb(colors.primary)) {
      errors.push('Invalid primary color format');
    }
    
    if (colors.secondary && !hexToRgb(colors.secondary)) {
      errors.push('Invalid secondary color format');
    }
    
    if (colors.accent && !hexToRgb(colors.accent)) {
      errors.push('Invalid accent color format');
    }
    
    // Check contrast ratios
    if (colors.primary && colors.background) {
      const ratio = getContrastRatio(colors.primary, colors.background);
      if (ratio < 3) {
        errors.push('Primary color has insufficient contrast against background');
      }
    }
  }
  
  // Validate logo
  if (branding.logo) {
    if (!branding.logo.url) {
      errors.push('Logo URL is required if logo is specified');
    }
    
    if (!branding.logo.alt) {
      errors.push('Logo alt text is required for accessibility');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Apply branding as CSS variables to an element
 */
export function applyCssVariables(branding: ProductBranding, element: HTMLElement = document.documentElement): void {
  const { colors, typography } = branding;
  
  // Apply color variables
  if (colors.primary) {
    element.style.setProperty('--brand-primary', colors.primary);
    const variations = generateColorVariations(colors.primary);
    Object.entries(variations).forEach(([key, value]) => {
      element.style.setProperty(`--brand-primary-${key}`, value);
    });
  }
  
  if (colors.secondary) {
    element.style.setProperty('--brand-secondary', colors.secondary);
  }
  
  if (colors.accent) {
    element.style.setProperty('--brand-accent', colors.accent);
  }
  
  if (colors.background) {
    element.style.setProperty('--brand-background', colors.background);
  }
  
  if (colors.textLight) {
    element.style.setProperty('--brand-text-light', colors.textLight);
  }
  
  if (colors.textDark) {
    element.style.setProperty('--brand-text-dark', colors.textDark);
  }
  
  if (colors.success) {
    element.style.setProperty('--brand-success', colors.success);
  }
  
  if (colors.warning) {
    element.style.setProperty('--brand-warning', colors.warning);
  }
  
  if (colors.error) {
    element.style.setProperty('--brand-error', colors.error);
  }
  
  // Apply typography variables
  if (typography?.fontFamily) {
    element.style.setProperty('--brand-font-family', typography.fontFamily);
  }
  
  if (typography?.headingFontFamily) {
    element.style.setProperty('--brand-heading-font', typography.headingFontFamily);
  }
  
  if (typography?.fontSize) {
    element.style.setProperty('--brand-font-size', typography.fontSize);
  }
  
  if (typography?.headingWeight) {
    element.style.setProperty('--brand-heading-weight', typography.headingWeight);
  }
  
  if (typography?.lineHeight) {
    element.style.setProperty('--brand-line-height', typography.lineHeight);
  }
  
  // Apply custom CSS variables
  if (branding.customCss) {
    Object.entries(branding.customCss).forEach(([key, value]) => {
      element.style.setProperty(key.startsWith('--') ? key : `--${key}`, value);
    });
  }
}

/**
 * Generate complete theme CSS for a branding configuration
 */
export function generateThemeCss(branding: ProductBranding): string {
  const { colors, typography } = branding;
  
  let css = ':root {\n';
  
  // Color variables
  if (colors.primary) {
    css += `  --brand-primary: ${colors.primary};\n`;
    const variations = generateColorVariations(colors.primary);
    Object.entries(variations).forEach(([key, value]) => {
      css += `  --brand-primary-${key}: ${value};\n`;
    });
  }
  
  if (colors.secondary) css += `  --brand-secondary: ${colors.secondary};\n`;
  if (colors.accent) css += `  --brand-accent: ${colors.accent};\n`;
  if (colors.background) css += `  --brand-background: ${colors.background};\n`;
  if (colors.textLight) css += `  --brand-text-light: ${colors.textLight};\n`;
  if (colors.textDark) css += `  --brand-text-dark: ${colors.textDark};\n`;
  if (colors.success) css += `  --brand-success: ${colors.success};\n`;
  if (colors.warning) css += `  --brand-warning: ${colors.warning};\n`;
  if (colors.error) css += `  --brand-error: ${colors.error};\n`;
  
  // Typography variables
  if (typography?.fontFamily) css += `  --brand-font-family: ${typography.fontFamily};\n`;
  if (typography?.headingFontFamily) css += `  --brand-heading-font: ${typography.headingFontFamily};\n`;
  if (typography?.fontSize) css += `  --brand-font-size: ${typography.fontSize};\n`;
  if (typography?.headingWeight) css += `  --brand-heading-weight: ${typography.headingWeight};\n`;
  if (typography?.lineHeight) css += `  --brand-line-height: ${typography.lineHeight};\n`;
  
  // Custom CSS
  if (branding.customCss) {
    Object.entries(branding.customCss).forEach(([key, value]) => {
      const cssKey = key.startsWith('--') ? key : `--${key}`;
      css += `  ${cssKey}: ${value};\n`;
    });
  }
  
  css += '}\n';
  
  return css;
}

/**
 * Remove branding CSS variables from an element
 */
export function removeBrandingVariables(element: HTMLElement = document.documentElement): void {
  const properties = [
    '--brand-primary',
    '--brand-secondary',
    '--brand-accent',
    '--brand-background',
    '--brand-text-light',
    '--brand-text-dark',
    '--brand-success',
    '--brand-warning',
    '--brand-error',
    '--brand-font-family',
    '--brand-heading-font',
    '--brand-font-size',
    '--brand-heading-weight',
    '--brand-line-height',
  ];
  
  // Remove color variations
  for (let i = 50; i <= 900; i += 50) {
    if (i === 50 || i >= 100) {
      properties.push(`--brand-primary-${i}`);
    }
  }
  
  properties.forEach(property => {
    element.style.removeProperty(property);
  });
}

/**
 * Create branding utilities object
 */
export const brandingUtils: BrandingUtils = {
  getBranding,
  applyCssVariables,
  generateThemeCss,
  mergeBranding,
  validateBranding,
  getContrastColor,
  hexToRgb,
  rgbToHex,
  isLightColor,
};

/**
 * Create default branding context
 */
export function createBrandingContext(): BrandingContext {
  return {
    currentBranding: undefined,
    availableBrandings: PRODUCT_BRANDING_PRESETS,
    isLoaded: true,
    defaultBranding: DEFAULT_BRANDING,
  };
}

/**
 * Get all available product keys
 */
export function getAvailableProducts(): string[] {
  return Object.keys(PRODUCT_BRANDING_PRESETS);
}

/**
 * Generate CSS class names for branding
 */
export function getBrandingClassNames(productKey?: string, prefix: string = 'brand'): Record<string, string> {
  if (!productKey) return {};
  
  return {
    primary: `${prefix}-${productKey}-primary`,
    secondary: `${prefix}-${productKey}-secondary`,
    accent: `${prefix}-${productKey}-accent`,
    background: `${prefix}-${productKey}-bg`,
    text: `${prefix}-${productKey}-text`,
    border: `${prefix}-${productKey}-border`,
  };
}