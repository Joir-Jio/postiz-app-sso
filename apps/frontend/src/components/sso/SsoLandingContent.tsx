'use client';

import { FC, useEffect, useState } from 'react';
import { useSsoAuth } from '@gitroom/frontend/hooks/useSsoAuth';
import { SsoLoader } from '@gitroom/frontend/components/sso/SsoLoader';
import { SsoError } from '@gitroom/frontend/components/sso/SsoError';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * SSO Landing Content Component
 * 
 * Main component for the seamless login page that orchestrates the entire
 * SSO authentication flow. This component:
 * 
 * 1. Uses the useSsoAuth hook to manage authentication state
 * 2. Shows appropriate loading states during authentication
 * 3. Displays success feedback when authentication succeeds
 * 4. Handles and displays errors with retry options
 * 5. Provides product branding integration
 * 6. Ensures accessibility and mobile responsiveness
 */
export const SsoLandingContent: FC = () => {
  const t = useT();
  const {
    isLoading,
    isAuthenticated,
    success,
    error,
    user,
    productBranding,
    redirectUrl,
    canAuthenticate,
    retryAuth,
    clearError,
  } = useSsoAuth();

  // Local state for managing loading steps
  const [currentStep, setCurrentStep] = useState<'validating' | 'authenticating' | 'redirecting' | 'loading'>('validating');
  const [showSuccess, setShowSuccess] = useState(false);

  // Update loading step based on authentication progress
  useEffect(() => {
    if (isLoading) {
      const stepSequence: Array<typeof currentStep> = ['validating', 'authenticating', 'redirecting'];
      let stepIndex = 0;

      const stepInterval = setInterval(() => {
        if (stepIndex < stepSequence.length) {
          setCurrentStep(stepSequence[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(stepInterval);
        }
      }, 1500);

      return () => clearInterval(stepInterval);
    }
  }, [isLoading]);

  // Handle success state display
  useEffect(() => {
    if (success && isAuthenticated) {
      setCurrentStep('loading');
      setShowSuccess(true);
    }
  }, [success, isAuthenticated]);

  // If we can't authenticate (no token), show appropriate error
  if (!canAuthenticate && !isLoading) {
    return (
      <SsoError
        error={t('sso_no_token', 'No authentication token provided')}
        canRetry={false}
        showSupport={true}
      />
    );
  }

  // Show error state
  if (error && !isLoading) {
    return (
      <SsoError
        error={error}
        onRetry={retryAuth}
        productBranding={productBranding}
        showSupport={true}
      />
    );
  }

  // Show success state
  if (showSuccess && !error) {
    return (
      <SsoSuccessDisplay
        user={user}
        productBranding={productBranding}
        redirectUrl={redirectUrl}
      />
    );
  }

  // Show loading state
  return (
    <SsoLoader
      step={currentStep}
      productBranding={productBranding}
      user={user}
      showProgress={true}
    />
  );
};

/**
 * Success Display Component
 * Shows confirmation when SSO authentication succeeds
 */
interface SsoSuccessDisplayProps {
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  productBranding?: {
    productKey: string;
    productName: string;
    logoUrl?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
  redirectUrl?: string;
}

const SsoSuccessDisplay: FC<SsoSuccessDisplayProps> = ({
  user,
  productBranding,
  redirectUrl,
}) => {
  const t = useT();

  return (
    <div className="text-center max-w-md mx-auto">
      {/* Success Animation */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          {/* Success checkmark with animation */}
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="animate-bounce"
            >
              <path 
                d="M9 12L11 14L15 10" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Product Flow Visualization */}
        {productBranding && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Product Logo */}
            {productBranding.logoUrl ? (
              <img
                src={productBranding.logoUrl}
                alt={`${productBranding.productName} logo`}
                className="w-8 h-8 rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {productBranding.productKey.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Success Arrow */}
            <div className="text-green-500">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.293 13.707a1 1 0 010-1.414L10.586 8 6.293 3.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
              </svg>
            </div>

            {/* Postiz Logo */}
            <div className="w-8 h-8 rounded-lg bg-forth flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary font-bold text-xs">P</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold text-textColor">
          {t('sso_success_title', 'Welcome to Postiz!')}
        </h2>
        
        <p className="text-gray-400">
          {productBranding 
            ? t('sso_success_from_product', 'Successfully signed in from {{product}}', { product: productBranding.productName })
            : t('sso_success_generic', 'You have been successfully authenticated')
          }
        </p>

        {/* User Welcome */}
        {user && (
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.email}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="text-left">
              <div className="font-medium text-textColor">
                {user.name ? t('sso_welcome_user', 'Welcome, {{name}}!', { name: user.name }) : t('sso_welcome_back', 'Welcome back!')}
              </div>
              <div className="text-sm text-gray-400">
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Redirect Information */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-green-500 rounded-full"></div>
          <span>{t('sso_redirecting_to_dashboard', 'Redirecting to your dashboard...')}</span>
        </div>
        
        {redirectUrl && (
          <p className="text-xs text-gray-500">
            {t('sso_redirect_destination', 'Taking you to: {{url}}', { url: redirectUrl })}
          </p>
        )}
      </div>

      {/* Manual Continue Option */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500 mb-3">
          {t('sso_redirect_manual', 'Not redirecting automatically?')}
        </p>
        
        <a
          href={redirectUrl || '/launches'}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
        >
          {t('sso_continue_manually', 'Continue to Postiz')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.293 13.707a1 1 0 010-1.414L10.586 8 6.293 3.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};