'use client';

import { Suspense } from 'react';
import { SsoLandingContent } from '@gitroom/frontend/components/sso/SsoLandingContent';

/**
 * SSO Landing Page - Zero-friction authentication entry point
 * 
 * This page handles users arriving from external products with authentication tokens.
 * It provides a seamless login experience that auto-processes tokens and redirects
 * to the publishing interface with preloaded content.
 * 
 * URL format: /seamless-login?token=<jwt>&challenge=<challenge>&state=<state>
 */
export default function SeamlessLoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        <Suspense fallback={<SsoLoadingFallback />}>
          <SsoLandingContent />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Loading fallback component for SSO landing
 */
function SsoLoadingFallback() {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-forth mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-textColor mb-2">
        Setting up your session...
      </h2>
      <p className="text-gray-400">
        Please wait while we authenticate your account.
      </p>
    </div>
  );
}