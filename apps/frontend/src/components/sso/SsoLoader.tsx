'use client';

import { FC, useMemo } from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * Props for SSO Loader component
 */
interface SsoLoaderProps {
  /** Current step in the authentication process */
  step: 'validating' | 'authenticating' | 'redirecting' | 'loading';
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
  /** User information if available */
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  /** Additional loading message */
  customMessage?: string;
  /** Whether to show detailed progress */
  showProgress?: boolean;
}

/**
 * SSO Loader Component
 * 
 * Shows loading states during the SSO authentication process with:
 * - Animated spinner and progress indicators
 * - Step-by-step progress feedback
 * - Product branding integration
 * - User context display when available
 * - Mobile-responsive design
 */
export const SsoLoader: FC<SsoLoaderProps> = ({
  step,
  productBranding,
  user,
  customMessage,
  showProgress = true,
}) => {
  const t = useT();

  // Step configuration with messages and progress
  const stepConfig = useMemo(() => {
    const steps = {
      validating: {
        title: t('sso_validating', 'Validating Authentication'),
        message: t('sso_validating_desc', 'Checking your authentication token...'),
        progress: 25,
        icon: '🔍',
      },
      authenticating: {
        title: t('sso_authenticating', 'Signing You In'),
        message: t('sso_authenticating_desc', 'Setting up your secure session...'),
        progress: 50,
        icon: '🔐',
      },
      redirecting: {
        title: t('sso_redirecting', 'Preparing Your Workspace'),
        message: t('sso_redirecting_desc', 'Loading your content and preferences...'),
        progress: 75,
        icon: '🚀',
      },
      loading: {
        title: t('sso_loading', 'Almost Ready'),
        message: t('sso_loading_desc', 'Finalizing your experience...'),
        progress: 90,
        icon: '✨',
      },
    };

    return steps[step];
  }, [step, t]);

  // Dynamic styling based on product branding
  const brandingStyles = useMemo(() => {
    if (!productBranding?.colors) return {};

    return {
      '--brand-primary': productBranding.colors.primary,
      '--brand-secondary': productBranding.colors.secondary,
    } as React.CSSProperties;
  }, [productBranding]);

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
                className="w-10 h-10 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {productBranding.productKey.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Arrow */}
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Postiz Logo */}
            <div className="w-10 h-10 rounded-lg bg-forth flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary font-bold text-sm">P</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            {t('sso_continuing_from', 'Continuing from')} 
            <span className="font-semibold text-textColor ml-1">
              {productBranding.productName}
            </span>
          </p>
        </div>
      )}

      {/* Main Loading Animation */}
      <div className="mb-6">
        {/* Animated Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div 
            className="absolute inset-0 border-4 border-gray-700 rounded-full"
            style={{ borderTopColor: 'var(--brand-primary, #3B82F6)' }}
          ></div>
          <div 
            className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
            style={{ borderTopColor: 'var(--brand-primary, #3B82F6)' }}
          ></div>
          
          {/* Step Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {stepConfig.icon}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${stepConfig.progress}%`,
                backgroundColor: 'var(--brand-primary, #3B82F6)',
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Step Title and Message */}
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold text-textColor">
          {stepConfig.title}
        </h2>
        
        <p className="text-gray-400">
          {customMessage || stepConfig.message}
        </p>
        
        {/* User Context */}
        {user && (
          <div className="flex items-center justify-center gap-3 pt-4 pb-2 border-t border-gray-700 mt-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.email}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="text-left">
              <div className="text-sm font-medium text-textColor">
                {user.name || 'Welcome back'}
              </div>
              <div className="text-xs text-gray-400">
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 0L7.5 2H10.5C11.3 2 12 2.7 12 3.5V9.5C12 10.3 11.3 11 10.5 11H1.5C0.7 11 0 10.3 0 9.5V3.5C0 2.7 0.7 2 1.5 2H4.5L6 0ZM6 3C4.3 3 3 4.3 3 6S4.3 9 6 9 9 7.7 9 6 7.7 3 6 3ZM6 7.5C5.2 7.5 4.5 6.8 4.5 6S5.2 4.5 6 4.5 7.5 5.2 7.5 6 6.8 7.5 6 7.5Z"/>
        </svg>
        <span>{t('sso_secure_connection', 'Secure connection')}</span>
      </div>

      {/* Pulsing dots animation for extra visual feedback */}
      <div className="flex justify-center space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--brand-primary, #3B82F6)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .flex > div:last-child {
          animation: pulse 1.4s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};