/**
 * Product Branding Type Definitions
 * 
 * This file defines all types related to dynamic product branding
 * for the multi-product SSO system.
 */

/**
 * Base product information
 */
export interface ProductInfo {
  /** Unique product key identifier */
  key: string;
  /** Display name for the product */
  name: string;
  /** Product description */
  description?: string;
  /** Product website URL */
  websiteUrl?: string;
  /** Support/help URL */
  supportUrl?: string;
}

/**
 * Color scheme for a product
 */
export interface ProductColorScheme {
  /** Primary brand color (hex) */
  primary: string;
  /** Secondary brand color (hex) */
  secondary?: string;
  /** Accent color for highlights (hex) */
  accent?: string;
  /** Background color (hex) */
  background?: string;
  /** Text color for light backgrounds (hex) */
  textLight?: string;
  /** Text color for dark backgrounds (hex) */
  textDark?: string;
  /** Success color (hex) */
  success?: string;
  /** Warning color (hex) */
  warning?: string;
  /** Error color (hex) */
  error?: string;
}

/**
 * Logo configuration for a product
 */
export interface ProductLogo {
  /** Main logo URL */
  url: string;
  /** Alternative logo URL (for dark backgrounds) */
  darkUrl?: string;
  /** Logo for small sizes (favicon style) */
  iconUrl?: string;
  /** Logo width in pixels */
  width?: number;
  /** Logo height in pixels */
  height?: number;
  /** Alt text for accessibility */
  alt: string;
}

/**
 * Typography settings for a product
 */
export interface ProductTypography {
  /** Primary font family */
  fontFamily?: string;
  /** Heading font family */
  headingFontFamily?: string;
  /** Monospace font family */
  monoFontFamily?: string;
  /** Base font size */
  fontSize?: string;
  /** Font weight for headings */
  headingWeight?: string;
  /** Line height */
  lineHeight?: string;
}

/**
 * Complete branding configuration for a product
 */
export interface ProductBranding {
  /** Product information */
  product: ProductInfo;
  /** Color scheme */
  colors: ProductColorScheme;
  /** Logo configuration */
  logo?: ProductLogo;
  /** Typography settings */
  typography?: ProductTypography;
  /** Custom CSS variables */
  customCss?: Record<string, string>;
  /** Theme preference (light/dark/auto) */
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Branding context for runtime use
 */
export interface BrandingContext {
  /** Current product branding */
  currentBranding?: ProductBranding;
  /** Available product brandings */
  availableBrandings: Record<string, ProductBranding>;
  /** Whether branding is loaded */
  isLoaded: boolean;
  /** Loading error */
  error?: string;
  /** Default/fallback branding */
  defaultBranding: ProductBranding;
}

/**
 * Branding component props
 */
export interface BrandingComponentProps {
  /** Product key to apply branding for */
  productKey?: string;
  /** Override branding configuration */
  branding?: Partial<ProductBranding>;
  /** Whether to apply branding to children */
  applyToChildren?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Light theme colors */
  light: ProductColorScheme;
  /** Dark theme colors */
  dark: ProductColorScheme;
  /** Typography settings */
  typography: ProductTypography;
  /** Spacing scale */
  spacing?: Record<string, string>;
  /** Border radius scale */
  borderRadius?: Record<string, string>;
  /** Shadow configurations */
  shadows?: Record<string, string>;
}

/**
 * Predefined product configurations
 */
export interface ProductBrandingRegistry {
  [productKey: string]: ProductBranding;
}

/**
 * Branding utility functions interface
 */
export interface BrandingUtils {
  /** Get branding for a product */
  getBranding: (productKey: string) => ProductBranding | null;
  /** Apply branding as CSS variables */
  applyCssVariables: (branding: ProductBranding, element?: HTMLElement) => void;
  /** Generate theme CSS */
  generateThemeCss: (branding: ProductBranding) => string;
  /** Merge branding configurations */
  mergeBranding: (base: ProductBranding, override: Partial<ProductBranding>) => ProductBranding;
  /** Validate branding configuration */
  validateBranding: (branding: Partial<ProductBranding>) => { valid: boolean; errors: string[] };
  /** Get contrast-safe text color */
  getContrastColor: (backgroundColor: string, lightColor?: string, darkColor?: string) => string;
  /** Convert hex to RGB */
  hexToRgb: (hex: string) => { r: number; g: number; b: number } | null;
  /** Convert RGB to hex */
  rgbToHex: (r: number, g: number, b: number) => string;
  /** Check if color is light or dark */
  isLightColor: (color: string) => boolean;
}

/**
 * Default branding configuration
 */
export const DEFAULT_BRANDING: ProductBranding = {
  product: {
    key: 'postiz',
    name: 'Postiz',
    description: 'Social Media Scheduling Platform',
    websiteUrl: 'https://postiz.com',
    supportUrl: 'https://postiz.com/support',
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#10B981',
    background: '#111827',
    textLight: '#000000',
    textDark: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monoFontFamily: 'JetBrains Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    fontSize: '14px',
    headingWeight: '600',
    lineHeight: '1.5',
  },
  theme: 'dark',
};

/**
 * Product branding presets for common external products
 */
export const PRODUCT_BRANDING_PRESETS: ProductBrandingRegistry = {
  'video-generation': {
    product: {
      key: 'video-generation',
      name: 'Video Generator',
      description: 'AI-Powered Video Creation',
    },
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#C084FC',
      background: '#1F2937',
      textLight: '#000000',
      textDark: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'dark',
  },
  'content-creator': {
    product: {
      key: 'content-creator',
      name: 'Content Creator',
      description: 'Content Creation Platform',
    },
    colors: {
      primary: '#F59E0B',
      secondary: '#FDE047',
      accent: '#FACC15',
      background: '#FEF3C7',
      textLight: '#000000',
      textDark: '#92400E',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'light',
  },
  'image-editor': {
    product: {
      key: 'image-editor',
      name: 'Image Editor',
      description: 'Professional Image Editing',
    },
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#F9A8D4',
      background: '#1F2937',
      textLight: '#000000',
      textDark: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'dark',
  },
  'analytics-dashboard': {
    product: {
      key: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      description: 'Data Analytics & Insights',
    },
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#67E8F9',
      background: '#0F172A',
      textLight: '#000000',
      textDark: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'dark',
  },
  'e-commerce': {
    product: {
      key: 'e-commerce',
      name: 'E-Commerce Platform',
      description: 'Online Store Management',
    },
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#34D399',
      background: '#FFFFFF',
      textLight: '#000000',
      textDark: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    theme: 'light',
  },
};