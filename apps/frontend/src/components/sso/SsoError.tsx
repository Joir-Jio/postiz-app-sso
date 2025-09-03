'use client';

import { FC, useMemo } from 'react';
import { Button } from '@gitroom/react/form/button';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * Props for SSO Error component
 */
interface SsoErrorProps {
  /** Error message to display */
  error: string;
  /** Whether to show retry button */
  canRetry?: boolean;
  /** Retry callback function */
  onRetry?: () => void;
  /** Product branding information */
  productBranding?: {
    productKey: string;
    productName: string;
    logoUrl?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
  /** Whether to show help/support options */
  showSupport?: boolean;
  /** Custom support URL */
  supportUrl?: string;
}

/**
 * SSO Error Component
 * 
 * Displays user-friendly error messages when SSO authentication fails with:
 * - Clear error explanations and suggested actions
 * - Retry functionality for recoverable errors
 * - Support links and contact options
 * - Product branding integration
 * - Graceful fallback options
 * - Mobile-responsive design
 */
export const SsoError: FC<SsoErrorProps> = ({
  error,
  canRetry = true,
  onRetry,
  productBranding,
  showSupport = true,
  supportUrl,
}) => {
  const t = useT();

  // Categorize error types and provide appropriate messaging
  const errorInfo = useMemo(() => {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('expired') || errorLower.includes('invalid')) {
      return {
        icon: '⏰',
        title: t('sso_error_expired_title', 'Authentication Link Expired'),
        description: t('sso_error_expired_desc', 'Your authentication link has expired or is no longer valid.'),
        suggestion: t('sso_error_expired_action', 'Please try signing in again from your original application.'),
        type: 'expired' as const,
      };
    }

    if (errorLower.includes('network') || errorLower.includes('connection') || errorLower.includes('timeout')) {
      return {
        icon: '📡',
        title: t('sso_error_network_title', 'Connection Problem'),
        description: t('sso_error_network_desc', 'We couldn\'t connect to our authentication servers.'),
        suggestion: t('sso_error_network_action', 'Please check your internet connection and try again.'),
        type: 'network' as const,
      };
    }

    if (errorLower.includes('permission') || errorLower.includes('unauthorized')) {
      return {
        icon: '🚫',
        title: t('sso_error_permission_title', 'Access Denied'),
        description: t('sso_error_permission_desc', 'You don\'t have permission to access this resource.'),
        suggestion: t('sso_error_permission_action', 'Please contact your administrator or try with a different account.'),
        type: 'permission' as const,
      };
    }

    if (errorLower.includes('missing') || errorLower.includes('incomplete')) {
      return {
        icon: '❓',
        title: t('sso_error_incomplete_title', 'Incomplete Authentication'),
        description: t('sso_error_incomplete_desc', 'The authentication request appears to be incomplete.'),
        suggestion: t('sso_error_incomplete_action', 'Please start the sign-in process again from your original application.'),
        type: 'incomplete' as const,
      };
    }

    // Generic error
    return {
      icon: '⚠️',
      title: t('sso_error_generic_title', 'Authentication Failed'),
      description: error,
      suggestion: t('sso_error_generic_action', 'Please try again or contact support if the problem persists.'),
      type: 'generic' as const,
    };
  }, [error, t]);

  // Dynamic styling based on product branding
  const brandingStyles = useMemo(() => {
    if (!productBranding?.colors) return {};

    return {
      '--brand-primary': productBranding.colors.primary,
      '--brand-secondary': productBranding.colors.secondary,
    } as React.CSSProperties;
  }, [productBranding]);

  // Determine retry availability based on error type
  const shouldShowRetry = canRetry && onRetry && errorInfo.type !== 'permission' && errorInfo.type !== 'expired';

  return (
    <div 
      className="text-center max-w-md mx-auto"
      style={brandingStyles}
    >
      {/* Product Branding Header */}
      {productBranding && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Product Logo */}
            {productBranding.logoUrl ? (
              <img
                src={productBranding.logoUrl}
                alt={`${productBranding.productName} logo`}
                className="w-10 h-10 rounded-lg opacity-60"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-lg opacity-60">
                {productBranding.productKey.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Broken Arrow */}
            <div className="text-red-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2L8.59 3.41L13.17 8H2V10H13.17L8.59 14.59L10 16L16 10L10 2Z" opacity="0.5" />
                <path d="M14 8L16 10L14 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            {/* Postiz Logo (grayed out) */}
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center opacity-60">
              <div className="w-6 h-6 bg-gray-600 rounded-sm flex items-center justify-center">
                <span className="text-gray-300 font-bold text-sm">P</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {t('sso_failed_from', 'Sign-in from')} 
            <span className="font-semibold text-gray-400 ml-1">
              {productBranding.productName}
            </span>
            {' '}
            {t('sso_failed', 'failed')}
          </p>
        </div>
      )}

      {/* Error Icon and Message */}
      <div className="mb-8">
        {/* Error Icon */}
        <div className="text-6xl mb-4">
          {errorInfo.icon}
        </div>

        {/* Error Title */}
        <h2 className="text-xl font-semibold text-textColor mb-3">
          {errorInfo.title}
        </h2>

        {/* Error Description */}
        <p className="text-gray-400 mb-4">
          {errorInfo.description}
        </p>

        {/* Suggestion */}
        <p className="text-sm text-gray-500 bg-gray-800 border border-gray-700 rounded-lg p-3">
          <strong className="text-gray-300">{t('sso_suggestion', 'Suggestion:')} </strong>
          {errorInfo.suggestion}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        {/* Retry Button */}
        {shouldShowRetry && (
          <Button
            onClick={onRetry}
            className="w-full"
            style={{ backgroundColor: 'var(--brand-primary, #3B82F6)' }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2C10.2091 2 12 3.79086 12 6V7H11V6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9C8.55228 9 9 9.44772 9 10C9 10.5523 8.55228 11 8 11C5.23858 11 3 8.76142 3 6C3 3.23858 5.23858 1 8 1C10.7614 1 13 3.23858 13 6V7C13 7.55228 12.5523 8 12 8C11.4477 8 11 7.55228 11 7V6C11 4.34315 9.65685 3 8 3Z"/>
              </svg>
              {t('sso_retry', 'Try Again')}
            </div>
          </Button>
        )}

        {/* Go to Login Button */}
        <Button
          onClick={() => window.location.href = '/auth/login'}
          secondary={true}
          className="w-full"
        >
          {t('sso_manual_login', 'Sign In Manually')}
        </Button>

        {/* Back to Product Button */}
        {productBranding && (
          <Button
            onClick={() => window.history.back()}
            className="w-full bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {t('sso_back_to_product', 'Back to')} {productBranding.productName}
          </Button>
        )}
      </div>

      {/* Support Section */}
      {showSupport && (
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            {t('sso_need_help', 'Need Help?')}
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <a
              href={supportUrl || 'https://postiz.com/support'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('sso_contact_support', 'Contact Support')}
            </a>
            
            <span className="hidden sm:inline text-gray-600">•</span>
            
            <a
              href="https://postiz.com/docs/sso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('sso_documentation', 'SSO Documentation')}
            </a>
            
            <span className="hidden sm:inline text-gray-600">•</span>
            
            <button
              onClick={() => {
                const subject = encodeURIComponent(`SSO Authentication Error: ${errorInfo.title}`);
                const body = encodeURIComponent(`
Error: ${error}
Product: ${productBranding?.productName || 'Unknown'}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
                `.trim());
                window.location.href = `mailto:support@postiz.com?subject=${subject}&body=${body}`;
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors text-left"
            >
              {t('sso_email_support', 'Email Support')}
            </button>
          </div>
        </div>
      )}

      {/* Debug Info (Development Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-3 bg-gray-900 border border-gray-700 rounded text-left">
          <div className="text-xs font-mono text-gray-400">
            <div className="font-semibold text-gray-300 mb-2">Debug Info:</div>
            <div>Error: {error}</div>
            <div>Type: {errorInfo.type}</div>
            <div>Timestamp: {new Date().toISOString()}</div>
            {productBranding && (
              <div>Product: {productBranding.productKey}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};