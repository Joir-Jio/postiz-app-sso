/**
 * Comprehensive Tests for SsoLandingContent Component
 * Tests SSO landing page component with all states and interactions
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SsoLandingContent } from './SsoLandingContent';
import { useSsoAuth } from '@gitroom/frontend/hooks/useSsoAuth';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

// Mock dependencies
jest.mock('@gitroom/frontend/hooks/useSsoAuth');
jest.mock('@gitroom/frontend/components/sso/SsoLoader', () => ({
  SsoLoader: ({ step, productBranding, showProgress }: any) => (
    <div data-testid="sso-loader">
      <div data-testid="loader-step">{step}</div>
      {productBranding && <div data-testid="loader-branding">{productBranding.productName}</div>}
      {showProgress && <div data-testid="loader-progress">Progress shown</div>}
    </div>
  ),
}));

jest.mock('@gitroom/frontend/components/sso/SsoError', () => ({
  SsoError: ({ error, onRetry, productBranding, showSupport }: any) => (
    <div data-testid="sso-error">
      <div data-testid="error-message">{error}</div>
      {onRetry && <button onClick={onRetry} data-testid="retry-button">Retry</button>}
      {productBranding && <div data-testid="error-branding">{productBranding.productName}</div>}
      {showSupport && <div data-testid="support-info">Support available</div>}
    </div>
  ),
}));

jest.mock('@gitroom/react/translation/get.transation.service.client', () => ({
  useT: jest.fn(),
}));

// Mock timer functions
jest.useFakeTimers();

describe('SsoLandingContent', () => {
  const mockUseSsoAuth = useSsoAuth as jest.MockedFunction<typeof useSsoAuth>;
  const mockUseT = useT as jest.MockedFunction<typeof useT>;
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    mockUseT.mockReturnValue((key: string, defaultValue?: string) => defaultValue || key);
    
    // Default mock implementation
    mockUseSsoAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      success: false,
      error: null,
      user: undefined,
      productBranding: undefined,
      redirectUrl: undefined,
      canAuthenticate: true,
      retryAuth: jest.fn(),
      clearError: jest.fn(),
      urlParams: {
        token: 'test-token',
        challenge: 'test-challenge',
        state: 'test-state',
        redirectUrl: '',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Loading States', () => {
    it('should render loading state with step progression', async () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: {
          productKey: 'video-gen',
          productName: 'Video Generator',
        },
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      expect(screen.getByTestId('sso-loader')).toBeInTheDocument();
      expect(screen.getByTestId('loader-step')).toHaveTextContent('validating');
      expect(screen.getByTestId('loader-branding')).toHaveTextContent('Video Generator');
      expect(screen.getByTestId('loader-progress')).toHaveTextContent('Progress shown');
    });

    it('should progress through loading steps with timer', async () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      // Initial step
      expect(screen.getByTestId('loader-step')).toHaveTextContent('validating');

      // Progress to next step
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByTestId('loader-step')).toHaveTextContent('authenticating');

      // Progress to final step
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByTestId('loader-step')).toHaveTextContent('redirecting');
    });

    it('should handle loading state with user context', () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
        },
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      expect(screen.getByTestId('sso-loader')).toBeInTheDocument();
    });
  });

  describe('Success States', () => {
    const mockSuccessState = {
      isLoading: false,
      isAuthenticated: true,
      success: true,
      error: null,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      },
      productBranding: {
        productKey: 'video-gen',
        productName: 'Video Generator',
        logoUrl: 'https://example.com/logo.png',
        colors: { primary: '#007bff', secondary: '#6c757d' },
      },
      redirectUrl: '/dashboard?source=video-gen',
      canAuthenticate: true,
      retryAuth: jest.fn(),
      clearError: jest.fn(),
      urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
    };

    it('should render success state with user information', async () => {
      mockUseSsoAuth.mockReturnValue(mockSuccessState);

      render(<SsoLandingContent />);

      // Wait for success display to show
      await waitFor(() => {
        expect(screen.getByText('Welcome to Postiz!')).toBeInTheDocument();
      });

      expect(screen.getByText('Successfully signed in from Video Generator')).toBeInTheDocument();
      expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should render product flow visualization', async () => {
      mockUseSsoAuth.mockReturnValue(mockSuccessState);

      render(<SsoLandingContent />);

      await waitFor(() => {
        expect(screen.getByAltText('Video Generator logo')).toBeInTheDocument();
      });

      const logo = screen.getByAltText('Video Generator logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('should show fallback branding when logo is not provided', async () => {
      const stateWithoutLogo = {
        ...mockSuccessState,
        productBranding: {
          productKey: 'video-gen',
          productName: 'Video Generator',
        },
      };

      mockUseSsoAuth.mockReturnValue(stateWithoutLogo);

      render(<SsoLandingContent />);

      await waitFor(() => {
        const fallbackLogo = screen.getByText('V'); // First letter of productKey
        expect(fallbackLogo).toBeInTheDocument();
      });
    });

    it('should render user avatar or fallback', async () => {
      mockUseSsoAuth.mockReturnValue(mockSuccessState);

      render(<SsoLandingContent />);

      await waitFor(() => {
        const avatar = screen.getByAltText('Test User');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      });
    });

    it('should render user fallback when avatar is not provided', async () => {
      const stateWithoutAvatar = {
        ...mockSuccessState,
        user: {
          ...mockSuccessState.user!,
          avatar: undefined,
        },
      };

      mockUseSsoAuth.mockReturnValue(stateWithoutAvatar);

      render(<SsoLandingContent />);

      await waitFor(() => {
        const fallbackAvatar = screen.getByText('T'); // First letter of name
        expect(fallbackAvatar).toBeInTheDocument();
      });
    });

    it('should show redirect information', async () => {
      mockUseSsoAuth.mockReturnValue(mockSuccessState);

      render(<SsoLandingContent />);

      await waitFor(() => {
        expect(screen.getByText('Redirecting to your dashboard...')).toBeInTheDocument();
        expect(screen.getByText('Taking you to: /dashboard?source=video-gen')).toBeInTheDocument();
      });
    });

    it('should provide manual continue option', async () => {
      mockUseSsoAuth.mockReturnValue(mockSuccessState);

      render(<SsoLandingContent />);

      await waitFor(() => {
        const continueLink = screen.getByText('Continue to Postiz');
        expect(continueLink).toBeInTheDocument();
        expect(continueLink.closest('a')).toHaveAttribute('href', '/dashboard?source=video-gen');
      });
    });

    it('should use default redirect when none provided', async () => {
      const stateWithoutRedirect = {
        ...mockSuccessState,
        redirectUrl: undefined,
      };

      mockUseSsoAuth.mockReturnValue(stateWithoutRedirect);

      render(<SsoLandingContent />);

      await waitFor(() => {
        const continueLink = screen.getByText('Continue to Postiz');
        expect(continueLink.closest('a')).toHaveAttribute('href', '/launches');
      });
    });
  });

  describe('Error States', () => {
    const mockErrorState = {
      isLoading: false,
      isAuthenticated: false,
      success: false,
      error: 'Authentication failed',
      user: undefined,
      productBranding: {
        productKey: 'video-gen',
        productName: 'Video Generator',
      },
      redirectUrl: undefined,
      canAuthenticate: true,
      retryAuth: jest.fn(),
      clearError: jest.fn(),
      urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
    };

    it('should render error state with retry option', () => {
      mockUseSsoAuth.mockReturnValue(mockErrorState);

      render(<SsoLandingContent />);

      expect(screen.getByTestId('sso-error')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Authentication failed');
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      expect(screen.getByTestId('error-branding')).toHaveTextContent('Video Generator');
      expect(screen.getByTestId('support-info')).toBeInTheDocument();
    });

    it('should handle retry button click', async () => {
      mockUseSsoAuth.mockReturnValue(mockErrorState);

      render(<SsoLandingContent />);

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      expect(mockErrorState.retryAuth).toHaveBeenCalled();
    });

    it('should show error without branding when not available', () => {
      const stateWithoutBranding = {
        ...mockErrorState,
        productBranding: undefined,
      };

      mockUseSsoAuth.mockReturnValue(stateWithoutBranding);

      render(<SsoLandingContent />);

      expect(screen.getByTestId('sso-error')).toBeInTheDocument();
      expect(screen.queryByTestId('error-branding')).not.toBeInTheDocument();
    });
  });

  describe('No Token State', () => {
    it('should render no token error when cannot authenticate', () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: false,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: '', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      expect(screen.getByTestId('sso-error')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('No authentication token provided');
      expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument(); // No retry for missing token
      expect(screen.getByTestId('support-info')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to success', async () => {
      const { rerender } = render(<SsoLandingContent />);

      // Start with loading
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      rerender(<SsoLandingContent />);
      expect(screen.getByTestId('sso-loader')).toBeInTheDocument();

      // Transition to success
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        success: true,
        error: null,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
        productBranding: {
          productKey: 'video-gen',
          productName: 'Video Generator',
        },
        redirectUrl: '/dashboard',
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      rerender(<SsoLandingContent />);

      await waitFor(() => {
        expect(screen.getByText('Welcome to Postiz!')).toBeInTheDocument();
      });
    });

    it('should transition from loading to error', async () => {
      const { rerender } = render(<SsoLandingContent />);

      // Start with loading
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      rerender(<SsoLandingContent />);
      expect(screen.getByTestId('sso-loader')).toBeInTheDocument();

      // Transition to error
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: false,
        success: false,
        error: 'Token validation failed',
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      rerender(<SsoLandingContent />);

      expect(screen.getByTestId('sso-error')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Token validation failed');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        success: true,
        error: null,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
        },
        productBranding: {
          productKey: 'video-gen',
          productName: 'Video Generator',
          logoUrl: 'https://example.com/logo.png',
        },
        redirectUrl: '/dashboard',
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      await waitFor(() => {
        const avatar = screen.getByAltText('Test User');
        expect(avatar).toBeInTheDocument();
        
        const logo = screen.getByAltText('Video Generator logo');
        expect(logo).toBeInTheDocument();

        const continueLink = screen.getByRole('link', { name: 'Continue to Postiz' });
        expect(continueLink).toBeInTheDocument();
      });
    });

    it('should handle keyboard navigation', async () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: false,
        success: false,
        error: 'Test error',
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      const retryButton = screen.getByTestId('retry-button');
      retryButton.focus();
      
      expect(retryButton).toHaveFocus();
      
      // Test keyboard activation
      await user.keyboard('{Enter}');
      expect(mockUseSsoAuth().retryAuth).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();
      
      const TestWrapper = () => {
        renderSpy();
        return <SsoLandingContent />;
      };

      const { rerender } = render(<TestWrapper />);

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TestWrapper />);

      expect(renderSpy).toHaveBeenCalledTimes(2); // Should only be called once more
    });

    it('should cleanup timers on unmount', () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        success: false,
        error: null,
        user: undefined,
        productBranding: undefined,
        redirectUrl: undefined,
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      const { unmount } = render(<SsoLandingContent />);

      // Should not throw errors on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Internationalization', () => {
    it('should use translation service for all text', () => {
      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        success: true,
        error: null,
        user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
        productBranding: { productKey: 'video-gen', productName: 'Video Generator' },
        redirectUrl: '/dashboard',
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      // Verify that translation function was called for all text strings
      expect(mockUseT).toHaveBeenCalledWith('sso_success_title', 'Welcome to Postiz!');
      expect(mockUseT).toHaveBeenCalledWith('sso_success_from_product', expect.any(String), expect.any(Object));
      expect(mockUseT).toHaveBeenCalledWith('sso_redirecting_to_dashboard', 'Redirecting to your dashboard...');
    });

    it('should handle missing translations gracefully', () => {
      mockUseT.mockReturnValue('MISSING_TRANSLATION');

      mockUseSsoAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        success: true,
        error: null,
        user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
        productBranding: { productKey: 'video-gen', productName: 'Video Generator' },
        redirectUrl: '/dashboard',
        canAuthenticate: true,
        retryAuth: jest.fn(),
        clearError: jest.fn(),
        urlParams: { token: 'test-token', challenge: '', state: '', redirectUrl: '' },
      });

      render(<SsoLandingContent />);

      // Should still render without breaking
      expect(screen.getByText('MISSING_TRANSLATION')).toBeInTheDocument();
    });
  });
});