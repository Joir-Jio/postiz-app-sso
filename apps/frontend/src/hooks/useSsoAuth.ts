'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * Types for SSO authentication hook
 */
interface SsoAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  organization?: {
    id: string;
    name: string;
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

interface SsoTokenValidation {
  valid: boolean;
  expired: boolean;
  error?: string;
  userContext?: {
    userId: string;
    organizationId: string;
    email: string;
    scopes: string[];
  };
}

interface SsoSessionInfo {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  organization?: {
    id: string;
    name: string;
  };
  productKey?: string;
}

/**
 * Custom hook for handling SSO authentication flow
 * 
 * This hook manages the entire SSO authentication process:
 * 1. Extract and validate tokens from URL parameters
 * 2. Process seamless authentication
 * 3. Handle loading states and errors
 * 4. Manage user session and redirect logic
 * 5. Provide product branding context
 */
export function useSsoAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetch = useFetch();
  const t = useT();

  const [state, setState] = useState<SsoAuthState>({
    isLoading: false,
    isAuthenticated: false,
    error: null,
    success: false,
  });

  // Extract URL parameters
  const urlParams = useMemo(() => {
    const token = searchParams?.get('token') || '';
    const challenge = searchParams?.get('challenge') || '';
    const stateParam = searchParams?.get('state') || '';
    const redirectUrl = searchParams?.get('redirect_url') || '';

    return { token, challenge, state: stateParam, redirectUrl };
  }, [searchParams]);

  /**
   * Validate SSO token
   */
  const validateToken = useCallback(async (token: string): Promise<SsoTokenValidation> => {
    try {
      // Direct call to backend API
      const response = await fetch('http://localhost:3000/sso/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Token validation failed: ${response.status}`);
      }

      const data = await response.json();
      // Map backend response to expected format
      return {
        valid: data.valid || false,
        expired: false,
        error: data.error,
        userContext: data.user ? {
          userId: data.user.id,
          organizationId: data.user.organizationId || '',
          email: data.user.email,
          scopes: data.user.scopes || [],
        } : undefined,
      };
    } catch (error) {
      return {
        valid: false,
        expired: false,
        error: error instanceof Error ? error.message : 'Token validation failed',
      };
    }
  }, [fetch]);

  /**
   * Get current SSO session information
   */
  const getSessionInfo = useCallback(async (token: string): Promise<SsoSessionInfo> => {
    try {
      // Use token-login endpoint to get session info - direct call to backend
      const response = await fetch('http://localhost:3000/sso/token-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      // Map backend response to expected format
      return {
        valid: data.success || false,
        user: data.user,
        organization: data.organization,
        productKey: data.productKey || 'postiz',
      };
    } catch (error) {
      return { valid: false };
    }
  }, [fetch]);

  /**
   * Process seamless login using backend endpoint
   */
  const processSeamlessLogin = useCallback(async () => {
    const { token, challenge, state, redirectUrl } = urlParams;

    if (!token) {
      setState(prev => ({
        ...prev,
        error: t('sso_missing_token', 'Authentication token is missing'),
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First validate the token to get user context
      const tokenValidation = await validateToken(token);

      if (!tokenValidation.valid) {
        throw new Error(tokenValidation.error || 'Invalid authentication token');
      }

      // Get session information if token is valid
      let sessionInfo: SsoSessionInfo | null = null;
      if (tokenValidation.userContext) {
        sessionInfo = await getSessionInfo(token);
      }

      // Now authenticate with the token through token-login - direct backend call
      const loginResponse = await fetch('http://localhost:3000/sso/token-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          productKey: sessionInfo?.productKey || 'postiz',
          redirectUrl: redirectUrl || '/launches'
        }),
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const loginData = await loginResponse.json();
      
      if (!loginData.success) {
        throw new Error(loginData.error || 'Authentication failed');
      }

      // Store the access token in both localStorage and HTTP cookie
      if (loginData.accessToken) {
        localStorage.setItem('gitroom-auth-token', loginData.accessToken);
        
        // Set HTTP cookie for middleware authentication
        const setCookie = (name: string, value: string, days: number = 7) => {
          const d = new Date();
          d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
          const expires = 'expires=' + d.toUTCString();
          
          // Always use development-friendly cookie settings for SSO
          // This ensures the middleware can read the cookie properly
          const cookieString = `${name}=${value};${expires};path=/;SameSite=Lax`;
          document.cookie = cookieString;
          
          console.log('🍪 Setting cookie:', {
            name,
            value: value.substring(0, 50) + '...',
            cookieString: cookieString.substring(0, 100) + '...'
          });
        };
        
        setCookie('auth', loginData.accessToken);
        
        // Verify cookie was set
        const cookieSet = document.cookie.includes('auth=');
        console.log('✅ Auth cookie set for SSO user:', {
          token: loginData.accessToken.substring(0, 50) + '...',
          cookieSet,
          allCookies: document.cookie.substring(0, 200) + '...'
        });
        
        // Additional verification - try to read the cookie back
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
        console.log('🔍 Cookie verification:', {
          found: !!authCookie,
          value: authCookie ? authCookie.substring(0, 70) + '...' : 'not found'
        });
      }

      // Update state with user information before redirect
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        success: true,
        user: loginData.user || sessionInfo?.user,
        organization: sessionInfo?.organization,
        productBranding: {
          productKey: sessionInfo?.productKey || 'postiz',
          productName: sessionInfo?.productKey?.replace('-', ' ')?.toUpperCase() || 'Postiz',
        },
        redirectUrl: redirectUrl || '/launches',
      }));

      // Wait a moment to ensure cookie is properly set before redirect
      setTimeout(() => {
        console.log('🚀 Redirecting to:', redirectUrl || '/launches');
        
        // Check if we're in an iframe (Shopify app context)
        const isInIframe = window !== window.parent;
        const targetUrl = redirectUrl || '/launches';
        
        if (isInIframe) {
          // For iframe context (like Shopify apps)
          console.log('📱 Detected iframe context, sending postMessage and staying in iframe');
          
          // Send postMessage to parent to notify success
          window.parent.postMessage({
            type: 'SSO_LOGIN_SUCCESS',
            payload: {
              success: true,
              redirectUrl: targetUrl,
              user: loginData.user,
              accessToken: loginData.accessToken
            }
          }, '*');
          
          // ✅ 关键修复: 在iframe内直接跳转，不尝试跳转父窗口
          // 因为cookie已经设置到iframe域内，所以iframe内的跳转应该成功
          console.log('🔄 Redirecting within iframe to:', targetUrl);
          router.push(targetUrl);
          
        } else {
          // Normal browser context, use router navigation
          router.push(targetUrl);
        }
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('sso_auth_failed', 'Authentication failed');

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        success: false,
      }));
    }
  }, [urlParams, validateToken, getSessionInfo, t]);

  /**
   * Retry authentication
   */
  const retryAuth = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    processSeamlessLogin();
  }, [processSeamlessLogin]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Check if we have valid parameters for authentication
   */
  const canAuthenticate = useMemo(() => {
    return Boolean(urlParams.token && urlParams.token.length > 0);
  }, [urlParams.token]);

  /**
   * Get user-friendly error message
   */
  const friendlyError = useMemo(() => {
    if (!state.error) return null;

    const errorMap: Record<string, string> = {
      'Token validation failed': t('sso_token_invalid', 'Your authentication link has expired or is invalid'),
      'Authentication failed': t('sso_auth_general_failed', 'We couldn\'t sign you in. Please try again'),
      'Invalid authentication token': t('sso_token_invalid', 'Your authentication link has expired or is invalid'),
      'Authentication token is missing': t('sso_missing_token_user', 'The authentication link appears to be incomplete'),
    };

    return errorMap[state.error] || state.error;
  }, [state.error, t]);

  // Auto-start authentication when component mounts and we have valid params
  useEffect(() => {
    if (canAuthenticate && !state.isLoading && !state.success && !state.error) {
      processSeamlessLogin();
    }
  }, [canAuthenticate, state.isLoading, state.success, state.error, processSeamlessLogin]);

  return {
    ...state,
    error: friendlyError,
    canAuthenticate,
    retryAuth,
    clearError,
    urlParams,
  };
}