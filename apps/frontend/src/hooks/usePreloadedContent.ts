'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { Media } from '@prisma/client';

/**
 * Types for preloaded content management
 */
interface PreloadedContentHints {
  /** Media IDs that should be preloaded */
  mediaIds?: string[];
  /** Preferred social platforms */
  platforms?: string[];
  /** Content type hint */
  contentType?: 'text' | 'image' | 'video' | 'carousel';
  /** Text content to pre-fill */
  textContent?: string;
  /** Tags to pre-select */
  tags?: string[];
  /** Scheduling preferences */
  schedulingHints?: {
    preferredTime?: Date;
    timezone?: string;
    recurring?: boolean;
  };
}

interface PreloadedContent {
  /** Preloaded media files ready for use */
  mediaFiles: Media[];
  /** User's connected social integrations */
  userIntegrations: Array<{
    platform: string;
    connected: boolean;
    username?: string;
    permissions?: string[];
  }>;
  /** Pre-filled text content */
  textContent?: string;
  /** Suggested tags */
  suggestedTags: string[];
  /** User preferences */
  userPreferences: {
    defaultPlatforms: string[];
    schedulingDefaults: {
      timezone: string;
      preferredTimes: string[];
    };
    contentDefaults: {
      includeHashtags: boolean;
      defaultVisibility: 'public' | 'private' | 'unlisted';
    };
  };
  /** Product context */
  productContext?: {
    productKey: string;
    productName: string;
    sessionId: string;
    originalUrl?: string;
  };
}

interface PreloadedContentState {
  isLoading: boolean;
  isPreloaded: boolean;
  error: string | null;
  content?: PreloadedContent;
  hints?: PreloadedContentHints;
  productKey?: string;
}

/**
 * Custom hook for managing preloaded content from SSO sessions
 * 
 * This hook handles:
 * 1. Loading preloaded content based on SSO context
 * 2. Managing content hints from external products
 * 3. Preloading media files automatically
 * 4. Providing publishing preferences and defaults
 * 5. Handling product-specific context and branding
 * 6. Managing session-based content persistence
 */
export function usePreloadedContent(productKey?: string, hints?: PreloadedContentHints) {
  const user = useUser();
  const fetch = useFetch();

  const [state, setState] = useState<PreloadedContentState>({
    isLoading: false,
    isPreloaded: false,
    error: null,
    hints,
    productKey,
  });

  /**
   * Load preloaded content for the current session
   */
  const loadPreloadedContent = useCallback(async (
    sessionProductKey?: string,
    contentHints?: PreloadedContentHints
  ): Promise<PreloadedContent | null> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const requestBody = {
      productKey: sessionProductKey || productKey || 'postiz',
      contentHints: contentHints || hints,
    };

    const response = await fetch('/auth/sso/preload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // You'd implement this
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to load preloaded content: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to load preloaded content');
    }

    return result.preloadedContent;
  }, [user?.id, productKey, hints, fetch]);

  /**
   * Initialize preloaded content
   */
  const initializePreloadedContent = useCallback(async (
    sessionProductKey?: string,
    contentHints?: PreloadedContentHints
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const content = await loadPreloadedContent(sessionProductKey, contentHints);
      
      if (content) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPreloaded: true,
          content,
          productKey: sessionProductKey || prev.productKey,
          hints: contentHints || prev.hints,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPreloaded: false,
          error: 'No preloaded content available',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPreloaded: false,
        error: error instanceof Error ? error.message : 'Failed to load preloaded content',
      }));
    }
  }, [loadPreloadedContent]);

  /**
   * Refresh preloaded content
   */
  const refreshPreloadedContent = useCallback(async () => {
    if (state.productKey) {
      await initializePreloadedContent(state.productKey, state.hints);
    }
  }, [state.productKey, state.hints, initializePreloadedContent]);

  /**
   * Update content hints
   */
  const updateContentHints = useCallback((newHints: Partial<PreloadedContentHints>) => {
    setState(prev => ({
      ...prev,
      hints: { ...prev.hints, ...newHints },
    }));
  }, []);

  /**
   * Get media files filtered by hints
   */
  const getFilteredMedia = useCallback((mediaFiles: Media[] = []) => {
    if (!state.hints) return mediaFiles;

    let filtered = mediaFiles;

    // Filter by media IDs if specified
    if (state.hints.mediaIds && state.hints.mediaIds.length > 0) {
      filtered = filtered.filter(media => 
        state.hints!.mediaIds!.includes(media.id)
      );
    }

    // Filter by content type if specified
    if (state.hints.contentType) {
      switch (state.hints.contentType) {
        case 'image':
          filtered = filtered.filter(media => 
            media.path && !media.path.includes('.mp4')
          );
          break;
        case 'video':
          filtered = filtered.filter(media => 
            media.path && media.path.includes('.mp4')
          );
          break;
        // For text and carousel, don't filter media
      }
    }

    return filtered;
  }, [state.hints]);

  /**
   * Get suggested platforms based on user integrations and hints
   */
  const getSuggestedPlatforms = useCallback(() => {
    if (!state.content) return [];

    const { userIntegrations, userPreferences } = state.content;
    const connectedPlatforms = userIntegrations
      .filter(integration => integration.connected)
      .map(integration => integration.platform);

    // If hints specify platforms, filter to those that are connected
    if (state.hints?.platforms) {
      return state.hints.platforms.filter(platform => 
        connectedPlatforms.includes(platform)
      );
    }

    // Otherwise, use user's default platforms that are connected
    return userPreferences.defaultPlatforms.filter(platform => 
      connectedPlatforms.includes(platform)
    );
  }, [state.content, state.hints]);

  /**
   * Get pre-filled form data for publishing
   */
  const getPrefilledFormData = useCallback(() => {
    if (!state.content) return {};

    const filteredMedia = getFilteredMedia(state.content.mediaFiles);
    const suggestedPlatforms = getSuggestedPlatforms();

    return {
      // Media
      upload: filteredMedia.map(media => ({
        id: media.id,
        path: media.path,
      })),

      // Text content
      content: state.hints?.textContent || state.content.textContent || '',

      // Platforms
      platforms: suggestedPlatforms,

      // Tags
      tags: state.hints?.tags || state.content.suggestedTags || [],

      // Scheduling
      scheduledDate: state.hints?.schedulingHints?.preferredTime,

      // Visibility
      visibility: state.content.userPreferences.contentDefaults.defaultVisibility,

      // Product context
      productContext: state.content.productContext,
    };
  }, [state.content, state.hints, getFilteredMedia, getSuggestedPlatforms]);

  /**
   * Check if content is ready for publishing
   */
  const isReadyToPublish = useMemo(() => {
    if (!state.isPreloaded || !state.content) return false;

    const prefilledData = getPrefilledFormData();

    // Check if we have content (text or media)
    const hasContent = Boolean(
      prefilledData.content || 
      (prefilledData.upload && prefilledData.upload.length > 0)
    );

    // Check if we have at least one platform selected
    const hasPlatforms = Boolean(
      prefilledData.platforms && prefilledData.platforms.length > 0
    );

    return hasContent && hasPlatforms;
  }, [state.isPreloaded, state.content, getPrefilledFormData]);

  /**
   * Get content statistics
   */
  const contentStats = useMemo(() => {
    if (!state.content) {
      return {
        mediaCount: 0,
        connectedPlatforms: 0,
        availablePlatforms: 0,
        hasTextContent: false,
        hasSchedulingHints: false,
      };
    }

    const filteredMedia = getFilteredMedia(state.content.mediaFiles);
    const connectedCount = state.content.userIntegrations.filter(i => i.connected).length;

    return {
      mediaCount: filteredMedia.length,
      connectedPlatforms: connectedCount,
      availablePlatforms: state.content.userIntegrations.length,
      hasTextContent: Boolean(state.content.textContent || state.hints?.textContent),
      hasSchedulingHints: Boolean(state.hints?.schedulingHints),
    };
  }, [state.content, state.hints, getFilteredMedia]);

  /**
   * Clear preloaded content
   */
  const clearPreloadedContent = useCallback(() => {
    setState({
      isLoading: false,
      isPreloaded: false,
      error: null,
      hints: undefined,
      productKey: undefined,
    });
  }, []);

  // Auto-initialize if product key is provided
  useEffect(() => {
    if (productKey && user?.id && !state.isPreloaded && !state.isLoading) {
      initializePreloadedContent(productKey, hints);
    }
  }, [productKey, user?.id, state.isPreloaded, state.isLoading, hints, initializePreloadedContent]);

  return {
    // State
    ...state,
    contentStats,
    isReadyToPublish,

    // Actions
    initializePreloadedContent,
    refreshPreloadedContent,
    updateContentHints,
    clearPreloadedContent,

    // Data helpers
    getFilteredMedia: () => getFilteredMedia(state.content?.mediaFiles),
    getSuggestedPlatforms,
    getPrefilledFormData,
  };
}

/**
 * Helper function to get auth token
 * This would need to be implemented based on your auth system
 */
function getAuthToken(): string {
  // In a real implementation, this would get the token from your auth system
  // For now, we'll try to get it from cookies or localStorage
  if (typeof document !== 'undefined') {
    // Try to get from cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth-token') {
        return value;
      }
    }
    
    // Try to get from localStorage
    const token = localStorage.getItem('auth-token');
    if (token) return token;
  }
  
  return '';
}