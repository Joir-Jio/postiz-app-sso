/**
 * Comprehensive Tests for useSsoAuth Hook
 * Tests SSO authentication hook with all scenarios
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useSsoAuth } from './useSsoAuth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@gitroom/helpers/utils/custom.fetch', () => ({
  useFetch: jest.fn(),
}));

jest.mock('@gitroom/react/translation/get.transation.service.client', () => ({
  useT: jest.fn(),
}));

// Mock window.location
delete (window as any).location;
window.location = {
  ...window.location,
  href: '',
  origin: 'http://localhost:4200',
};

describe('useSsoAuth', () => {
  let mockRouter: any;
  let mockSearchParams: any;
  let mockFetch: jest.MockedFunction<any>;
  let mockT: jest.MockedFunction<any>;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
    };

    mockSearchParams = {
      get: jest.fn(),
    };

    mockFetch = jest.fn();
    mockT = jest.fn((key, defaultValue) => defaultValue || key);

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useFetch as jest.Mock).mockReturnValue(mockFetch);
    (useT as jest.Mock).mockReturnValue(mockT);

    // Reset window.location.href
    window.location.href = '';

    // Setup default URL parameters
    mockSearchParams.get.mockImplementation((param: string) => {
      const params = {
        token: 'test-token-123',
        challenge: 'test-challenge',
        state: 'test-state',
        redirect_url: '/dashboard?source=video-gen',
      };
      return params[param as keyof typeof params] || null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('URL Parameter Extraction', () => {
    it('should extract all URL parameters correctly', () => {
      const { result } = renderHook(() => useSsoAuth());

      expect(result.current.urlParams.token).toBe('test-token-123');
      expect(result.current.urlParams.challenge).toBe('test-challenge');
      expect(result.current.urlParams.state).toBe('test-state');
      expect(result.current.urlParams.redirectUrl).toBe('/dashboard?source=video-gen');
    });

    it('should handle missing URL parameters gracefully', () => {
      mockSearchParams.get.mockReturnValue(null);

      const { result } = renderHook(() => useSsoAuth());

      expect(result.current.urlParams.token).toBe('');
      expect(result.current.urlParams.challenge).toBe('');
      expect(result.current.urlParams.state).toBe('');
      expect(result.current.urlParams.redirectUrl).toBe('');
      expect(result.current.canAuthenticate).toBe(false);
    });

    it('should determine canAuthenticate based on token presence', () => {
      const { result } = renderHook(() => useSsoAuth());
      expect(result.current.canAuthenticate).toBe(true);

      // Test with empty token
      mockSearchParams.get.mockImplementation((param: string) => 
        param === 'token' ? '' : 'test-value'
      );

      const { result: resultEmpty } = renderHook(() => useSsoAuth());
      expect(resultEmpty.current.canAuthenticate).toBe(false);
    });
  });

  describe('Token Validation', () => {
    it('should validate token successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: {
            userId: 'user-123',
            organizationId: 'org-123',
            email: 'test@example.com',
            scopes: ['sso:login'],
          },
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(mockFetch).toHaveBeenCalledWith('/auth/sso/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test-token-123' }),
      });
    });

    it('should handle invalid token validation', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toContain('Token validation failed');
      expect(result.current.success).toBe(false);
    });

    it('should handle token validation network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toContain('Network error');
      expect(result.current.success).toBe(false);
    });

    it('should return user-friendly error messages', () => {
      const { result } = renderHook(() => useSsoAuth());

      // Test error mapping
      act(() => {
        (result.current as any).setState({
          error: 'Token validation failed',
        });
      });

      expect(result.current.error).toBe('Your authentication link has expired or is invalid');
    });
  });

  describe('Session Information', () => {
    it('should fetch session information with valid token', async () => {
      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      const mockSessionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
          organization: { id: 'org-123', name: 'Test Org' },
          productKey: 'video-gen',
        }),
      };

      mockFetch
        .mockResolvedValueOnce(mockValidationResponse)
        .mockResolvedValueOnce(mockSessionResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(mockFetch).toHaveBeenCalledWith('/auth/sso/session', {
        method: 'GET',
        headers: { Authorization: 'Bearer test-token-123' },
      });

      expect(result.current.user?.name).toBe('Test User');
      expect(result.current.organization?.name).toBe('Test Org');
      expect(result.current.productBranding?.productKey).toBe('video-gen');
    });

    it('should handle session fetch failures gracefully', async () => {
      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      const mockSessionResponse = {
        ok: false,
        status: 404,
      };

      mockFetch
        .mockResolvedValueOnce(mockValidationResponse)
        .mockResolvedValueOnce(mockSessionResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      // Should still proceed with authentication even if session fetch fails
      expect(result.current.success).toBe(true);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('Authentication Process', () => {
    it('should process seamless login automatically', async () => {
      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      mockFetch.mockResolvedValue(mockValidationResponse);

      const { result } = renderHook(() => useSsoAuth());

      // Should automatically start authentication
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should redirect to seamless login URL after success', async () => {
      jest.useFakeTimers();

      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      mockFetch.mockResolvedValue(mockValidationResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      // Fast-forward to trigger redirect timeout
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(window.location.href).toContain('/seamless-login');
      expect(window.location.href).toContain('token=test-token-123');
      expect(window.location.href).toContain('challenge=test-challenge');

      jest.useRealTimers();
    });

    it('should include all URL parameters in redirect', async () => {
      jest.useFakeTimers();

      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      mockFetch.mockResolvedValue(mockValidationResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      const redirectUrl = new URL(window.location.href);
      expect(redirectUrl.searchParams.get('token')).toBe('test-token-123');
      expect(redirectUrl.searchParams.get('challenge')).toBe('test-challenge');
      expect(redirectUrl.searchParams.get('state')).toBe('test-state');
      expect(redirectUrl.searchParams.get('redirect_url')).toBe('/dashboard?source=video-gen');

      jest.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing token error', () => {
      mockSearchParams.get.mockReturnValue(null);

      const { result } = renderHook(() => useSsoAuth());

      expect(result.current.error).toBe('The authentication link appears to be incomplete');
      expect(result.current.canAuthenticate).toBe(false);
    });

    it('should provide retry functionality', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toBeDefined();

      // Clear error and retry
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();

      // Test retry function
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ valid: true, payload: {} }),
      });

      act(() => {
        result.current.retryAuth();
      });

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.success).toBe(true);
    });

    it('should handle authentication failures gracefully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: false,
          error: 'Token expired',
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toBe('Your authentication link has expired or is invalid');
      expect(result.current.success).toBe(false);
    });
  });

  describe('Product Branding', () => {
    it('should extract product branding from session info', async () => {
      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      const mockSessionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          user: { id: 'user-123', email: 'test@example.com' },
          organization: { id: 'org-123', name: 'Test Org' },
          productKey: 'video-generation-tool',
        }),
      };

      mockFetch
        .mockResolvedValueOnce(mockValidationResponse)
        .mockResolvedValueOnce(mockSessionResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.productBranding?.productKey).toBe('video-generation-tool');
      expect(result.current.productBranding?.productName).toBe('VIDEO GENERATION TOOL');
    });

    it('should generate fallback product branding', async () => {
      const mockValidationResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      // No session info available
      mockFetch.mockResolvedValueOnce(mockValidationResponse);

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.productBranding?.productKey).toBe('unknown');
      expect(result.current.productBranding?.productName).toBe('External Product');
    });
  });

  describe('State Management', () => {
    it('should not auto-start authentication if already loading', () => {
      const { result } = renderHook(() => useSsoAuth());

      // Should only start once even with multiple re-renders
      const initialLoadingState = result.current.isLoading;
      
      expect(initialLoadingState).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should not auto-start authentication if already successful', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.success).toBe(true);
      const callCount = mockFetch.mock.calls.length;

      // Re-render should not trigger another authentication
      rerender();
      
      expect(mockFetch.mock.calls.length).toBe(callCount);
    });

    it('should not auto-start authentication if error exists', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toBeDefined();
      const callCount = mockFetch.mock.calls.length;

      // Re-render should not trigger another authentication
      rerender();
      
      expect(mockFetch.mock.calls.length).toBe(callCount);
    });
  });

  describe('Memory and Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useSsoAuth());

      // Should not throw errors on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle component updates correctly', () => {
      const { result, rerender } = renderHook(() => useSsoAuth());

      const initialState = { ...result.current };

      // Re-render with same props
      rerender();

      // State should remain consistent
      expect(result.current.canAuthenticate).toBe(initialState.canAuthenticate);
      expect(result.current.urlParams).toEqual(initialState.urlParams);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed URL parameters', () => {
      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'token') return 'malformed-token-with-special-chars!@#$%';
        if (param === 'redirect_url') return 'javascript:alert("xss")';
        return 'test-value';
      });

      const { result } = renderHook(() => useSsoAuth());

      expect(result.current.canAuthenticate).toBe(true); // Should still try to authenticate
      expect(result.current.urlParams.token).toBe('malformed-token-with-special-chars!@#$%');
    });

    it('should handle extremely long tokens', () => {
      const longToken = 'a'.repeat(10000);
      mockSearchParams.get.mockImplementation((param: string) => 
        param === 'token' ? longToken : 'test-value'
      );

      const { result } = renderHook(() => useSsoAuth());

      expect(result.current.canAuthenticate).toBe(true);
      expect(result.current.urlParams.token).toBe(longToken);
    });

    it('should handle fetch service unavailability', async () => {
      mockFetch.mockImplementation(() => {
        throw new Error('Service temporarily unavailable');
      });

      const { result } = renderHook(() => useSsoAuth());

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.error).toBe('We couldn\'t sign you in. Please try again');
      expect(result.current.success).toBe(false);
    });

    it('should handle concurrent authentication attempts', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          valid: true,
          payload: { userId: 'user-123' },
        }),
      };

      let resolveFirst: (value: any) => void;
      let resolveSecond: (value: any) => void;

      mockFetch
        .mockReturnValueOnce(new Promise(resolve => { resolveFirst = resolve; }))
        .mockReturnValueOnce(new Promise(resolve => { resolveSecond = resolve; }));

      const { result } = renderHook(() => useSsoAuth());

      // Trigger retry while first request is pending
      act(() => {
        result.current.retryAuth();
      });

      // Resolve both requests
      act(() => {
        resolveFirst!(mockResponse);
        resolveSecond!(mockResponse);
      });

      await act(async () => {
        await waitFor(() => expect(result.current.isLoading).toBe(false));
      });

      expect(result.current.success).toBe(true);
    });
  });
});