'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { Media } from '@prisma/client';

/**
 * Types for external media management
 */
interface ExternalMediaFile {
  id: string;
  name: string;
  path: string;
  type: 'image' | 'video';
  size: number;
  url: string;
  thumbnail?: string;
  productKey: string;
  productName: string;
  originalPath: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface MediaReference {
  id: string;
  userId: string;
  originalGcsPath: string;
  originalFilename: string;
  postizMediaId?: string;
  isPreloaded: boolean;
  productKey: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  postizMedia?: Media;
}

interface ExternalMediaState {
  isLoading: boolean;
  error: string | null;
  externalFiles: ExternalMediaFile[];
  mediaReferences: MediaReference[];
  totalFiles: number;
  currentPage: number;
  totalPages: number;
  preloadingFiles: Set<string>;
  preloadedFiles: Map<string, Media>;
}

interface PreloadResult {
  success: boolean;
  media?: Media;
  error?: string;
}

interface MediaFilters {
  productKey?: string;
  type?: 'image' | 'video';
  search?: string;
  onlyPreloaded?: boolean;
}

/**
 * Custom hook for managing external media files and references
 * 
 * This hook handles:
 * 1. Fetching external media files from GCS via product mappings
 * 2. Managing media references and preloading status
 * 3. Preloading external files into Postiz media library
 * 4. Mixed display of external and uploaded media
 * 5. Search and filtering capabilities
 * 6. Real-time sync with backend services
 */
export function useExternalMedia(filters: MediaFilters = {}) {
  const user = useUser();
  const fetch = useFetch();

  const [state, setState] = useState<ExternalMediaState>({
    isLoading: false,
    error: null,
    externalFiles: [],
    mediaReferences: [],
    totalFiles: 0,
    currentPage: 1,
    totalPages: 1,
    preloadingFiles: new Set(),
    preloadedFiles: new Map(),
  });

  /**
   * Fetch external media files for the current user
   */
  const fetchExternalMedia = useCallback(async (page: number = 1): Promise<void> => {
    if (!user?.id) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filters.productKey) params.set('productKey', filters.productKey);
      if (filters.type) params.set('type', filters.type);
      if (filters.search) params.set('search', filters.search);
      if (filters.onlyPreloaded) params.set('onlyPreloaded', 'true');

      const response = await fetch(`/api/external-media?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch external media: ${response.status}`);
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        isLoading: false,
        externalFiles: data.files || [],
        mediaReferences: data.references || [],
        totalFiles: data.total || 0,
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / 20),
      }));

      // Update preloaded files map
      const preloadedMap = new Map<string, Media>();
      data.references?.forEach((ref: MediaReference) => {
        if (ref.postizMedia && ref.isPreloaded) {
          preloadedMap.set(ref.originalGcsPath, ref.postizMedia);
        }
      });

      setState(prev => ({
        ...prev,
        preloadedFiles: preloadedMap,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load external media',
      }));
    }
  }, [user?.id, filters, fetch]);

  /**
   * Preload an external media file into Postiz media library
   */
  const preloadMediaFile = useCallback(async (
    gcsPath: string,
    filename: string,
    productKey: string
  ): Promise<PreloadResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    // Add to preloading set
    setState(prev => ({
      ...prev,
      preloadingFiles: new Set([...prev.preloadingFiles, gcsPath]),
    }));

    try {
      const response = await fetch('/api/external-media/preload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gcsPath,
          filename,
          productKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to preload media: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.media) {
        // Update preloaded files map
        setState(prev => {
          const newPreloadedFiles = new Map(prev.preloadedFiles);
          newPreloadedFiles.set(gcsPath, result.media);
          
          return {
            ...prev,
            preloadedFiles: newPreloadedFiles,
            preloadingFiles: new Set([...prev.preloadingFiles].filter(path => path !== gcsPath)),
          };
        });

        return { success: true, media: result.media };
      }

      return { success: false, error: result.error || 'Preload failed' };

    } catch (error) {
      setState(prev => ({
        ...prev,
        preloadingFiles: new Set([...prev.preloadingFiles].filter(path => path !== gcsPath)),
      }));

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to preload media',
      };
    }
  }, [user?.id, fetch]);

  /**
   * Batch preload multiple media files
   */
  const batchPreloadFiles = useCallback(async (
    files: Array<{ gcsPath: string; filename: string; productKey: string }>
  ): Promise<Array<PreloadResult>> => {
    const results = await Promise.all(
      files.map(file => preloadMediaFile(file.gcsPath, file.filename, file.productKey))
    );

    // Refresh the media list after batch preload
    if (results.some(result => result.success)) {
      await fetchExternalMedia(state.currentPage);
    }

    return results;
  }, [preloadMediaFile, fetchExternalMedia, state.currentPage]);

  /**
   * Remove a media reference (stop tracking external file)
   */
  const removeMediaReference = useCallback(async (referenceId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/external-media/references/${referenceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the media list
        await fetchExternalMedia(state.currentPage);
        return true;
      }

      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove media reference',
      }));
      return false;
    }
  }, [fetch, fetchExternalMedia, state.currentPage]);

  /**
   * Sync external media references (refresh from GCS)
   */
  const syncExternalMedia = useCallback(async (productKey?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      if (productKey) params.set('productKey', productKey);

      const response = await fetch(`/api/external-media/sync?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the media list after sync
        await fetchExternalMedia(1);
        return true;
      }

      throw new Error(`Sync failed: ${response.status}`);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sync external media',
      }));
      return false;
    }
  }, [fetch, fetchExternalMedia]);

  /**
   * Get combined media list (external + uploaded)
   */
  const getCombinedMediaList = useCallback((uploadedMedia: Media[] = []): Media[] => {
    const combinedList: Media[] = [...uploadedMedia];

    // Add preloaded external media
    state.preloadedFiles.forEach((media) => {
      // Avoid duplicates
      if (!combinedList.find(m => m.id === media.id)) {
        combinedList.push(media);
      }
    });

    // Sort by creation date (newest first)
    return combinedList.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [state.preloadedFiles]);

  /**
   * Check if a file is currently being preloaded
   */
  const isPreloading = useCallback((gcsPath: string): boolean => {
    return state.preloadingFiles.has(gcsPath);
  }, [state.preloadingFiles]);

  /**
   * Check if a file is already preloaded
   */
  const isPreloaded = useCallback((gcsPath: string): Media | null => {
    return state.preloadedFiles.get(gcsPath) || null;
  }, [state.preloadedFiles]);

  /**
   * Get media statistics
   */
  const mediaStats = useMemo(() => {
    const totalExternal = state.externalFiles.length;
    const totalPreloaded = state.preloadedFiles.size;
    const totalPreloading = state.preloadingFiles.size;

    const byProduct = state.externalFiles.reduce((acc, file) => {
      acc[file.productKey] = (acc[file.productKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = state.externalFiles.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, { image: 0, video: 0 });

    return {
      totalExternal,
      totalPreloaded,
      totalPreloading,
      byProduct,
      byType,
    };
  }, [state.externalFiles, state.preloadedFiles, state.preloadingFiles]);

  /**
   * Page navigation functions
   */
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchExternalMedia(page);
    }
  }, [fetchExternalMedia, state.totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(state.currentPage + 1);
  }, [goToPage, state.currentPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(state.currentPage - 1);
  }, [goToPage, state.currentPage]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (user?.id) {
      fetchExternalMedia(1);
    }
  }, [user?.id, filters.productKey, filters.type, filters.search, filters.onlyPreloaded]);

  return {
    // State
    ...state,
    mediaStats,

    // Actions
    fetchExternalMedia,
    preloadMediaFile,
    batchPreloadFiles,
    removeMediaReference,
    syncExternalMedia,
    getCombinedMediaList,

    // Utilities
    isPreloading,
    isPreloaded,
    
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: state.currentPage < state.totalPages,
    hasPreviousPage: state.currentPage > 1,

    // Refresh
    refresh: () => fetchExternalMedia(state.currentPage),
  };
}