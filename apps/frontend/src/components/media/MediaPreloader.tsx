'use client';

import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useExternalMedia } from '@gitroom/frontend/hooks/useExternalMedia';
import { Button } from '@gitroom/react/form/button';
import { Media } from '@prisma/client';

/**
 * Types for Media Preloader
 */
interface PreloadStrategy {
  /** Maximum number of files to preload automatically */
  maxAutoPreload: number;
  /** Prioritize recent files */
  prioritizeRecent: boolean;
  /** Prioritize specific file types */
  prioritizeTypes?: ('image' | 'video')[];
  /** Prioritize specific products */
  prioritizeProducts?: string[];
  /** File size limit for auto-preload (bytes) */
  fileSizeLimit?: number;
}

interface MediaPreloaderProps {
  /** Product context for targeted preloading */
  productKey?: string;
  /** Preload strategy configuration */
  strategy?: PreloadStrategy;
  /** Whether to show the preloading UI */
  showProgress?: boolean;
  /** Whether to auto-start preloading */
  autoStart?: boolean;
  /** Callback when preloading completes */
  onPreloadComplete?: (preloadedMedia: Media[]) => void;
  /** Callback for preload progress updates */
  onProgressUpdate?: (progress: { completed: number; total: number; current?: string }) => void;
  /** Whether to show detailed status */
  showDetails?: boolean;
  /** Custom className */
  className?: string;
}

interface PreloadProgress {
  total: number;
  completed: number;
  failed: number;
  current: string | null;
  isRunning: boolean;
  results: Array<{
    filename: string;
    success: boolean;
    error?: string;
    media?: Media;
  }>;
}

/**
 * Media Preloader Component
 * 
 * Automatically preloads external media files into the Postiz media library with:
 * - Intelligent preload strategy (recent files, specific types, size limits)
 * - Progress tracking and user feedback
 * - Batch processing with error handling
 * - Background processing without blocking UI
 * - Integration with SSO context for targeted preloading
 * - Fallback and retry mechanisms
 * - Performance optimization
 */
export const MediaPreloader: FC<MediaPreloaderProps> = ({
  productKey,
  strategy = {
    maxAutoPreload: 10,
    prioritizeRecent: true,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
  },
  showProgress = true,
  autoStart = false,
  onPreloadComplete,
  onProgressUpdate,
  showDetails = false,
  className,
}) => {
  const t = useT();
  
  // External media hook
  const {
    externalFiles,
    mediaStats,
    isLoading,
    error,
    preloadMediaFile,
    batchPreloadFiles,
    isPreloaded,
    syncExternalMedia,
    refresh,
  } = useExternalMedia({
    productKey,
    onlyPreloaded: false,
  });

  // Progress state
  const [progress, setProgress] = useState<PreloadProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    current: null,
    isRunning: false,
    results: [],
  });

  const [hasStarted, setHasStarted] = useState(false);

  /**
   * Get files to preload based on strategy
   */
  const filesToPreload = useMemo(() => {
    if (!externalFiles.length) return [];

    let candidates = externalFiles.filter(file => {
      // Skip already preloaded files
      if (isPreloaded(file.originalPath)) return false;

      // Apply file size limit
      if (strategy.fileSizeLimit && file.size > strategy.fileSizeLimit) return false;

      // Apply type filter
      if (strategy.prioritizeTypes && !strategy.prioritizeTypes.includes(file.type)) return false;

      // Apply product filter
      if (strategy.prioritizeProducts && !strategy.prioritizeProducts.includes(file.productKey)) return false;

      return true;
    });

    // Sort by priority
    if (strategy.prioritizeRecent) {
      candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Limit to max auto preload
    return candidates.slice(0, strategy.maxAutoPreload);
  }, [externalFiles, strategy, isPreloaded]);

  /**
   * Start preloading process
   */
  const startPreloading = useCallback(async () => {
    if (progress.isRunning || !filesToPreload.length) return;

    setHasStarted(true);
    setProgress(prev => ({
      ...prev,
      total: filesToPreload.length,
      completed: 0,
      failed: 0,
      current: null,
      isRunning: true,
      results: [],
    }));

    const results: PreloadProgress['results'] = [];
    let completed = 0;
    let failed = 0;

    for (const file of filesToPreload) {
      setProgress(prev => ({ ...prev, current: file.name }));

      try {
        const result = await preloadMediaFile(file.originalPath, file.name, file.productKey);
        
        if (result.success && result.media) {
          results.push({
            filename: file.name,
            success: true,
            media: result.media,
          });
          completed++;
        } else {
          results.push({
            filename: file.name,
            success: false,
            error: result.error || 'Unknown error',
          });
          failed++;
        }
      } catch (error) {
        results.push({
          filename: file.name,
          success: false,
          error: error instanceof Error ? error.message : 'Preload failed',
        });
        failed++;
      }

      // Update progress
      setProgress(prev => ({
        ...prev,
        completed: completed,
        failed: failed,
        results: results,
      }));

      // Call progress update callback
      onProgressUpdate?.({
        completed: completed + failed,
        total: filesToPreload.length,
        current: file.name,
      });

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Finalize progress
    setProgress(prev => ({
      ...prev,
      current: null,
      isRunning: false,
    }));

    // Call completion callback with successful preloads
    const successfulMedia = results
      .filter(result => result.success && result.media)
      .map(result => result.media!);

    if (successfulMedia.length > 0) {
      onPreloadComplete?.(successfulMedia);
    }

    // Refresh external media list
    await refresh();
  }, [filesToPreload, progress.isRunning, preloadMediaFile, onProgressUpdate, onPreloadComplete, refresh]);

  /**
   * Stop preloading process
   */
  const stopPreloading = useCallback(() => {
    setProgress(prev => ({ ...prev, isRunning: false, current: null }));
  }, []);

  /**
   * Reset preloader state
   */
  const resetPreloader = useCallback(() => {
    setProgress({
      total: 0,
      completed: 0,
      failed: 0,
      current: null,
      isRunning: false,
      results: [],
    });
    setHasStarted(false);
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !hasStarted && filesToPreload.length > 0 && !progress.isRunning) {
      startPreloading();
    }
  }, [autoStart, hasStarted, filesToPreload.length, progress.isRunning, startPreloading]);

  // Don't render if no files to preload and not showing progress
  if (!showProgress && (!filesToPreload.length || (!progress.isRunning && !hasStarted))) {
    return null;
  }

  return (
    <div className={`bg-newBgColorInner border border-tableBorder rounded-lg p-4 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-textColor">
            {t('media_preloader_title', 'Media Preloader')}
          </h3>
          <p className="text-sm text-gray-400">
            {productKey 
              ? t('media_preloader_product_desc', 'Preloading media from {{product}}', { product: productKey })
              : t('media_preloader_desc', 'Automatically preload external media files')
            }
          </p>
        </div>

        {/* Status Badge */}
        {progress.isRunning && (
          <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            {t('media_preloader_running', 'Preloading...')}
          </div>
        )}
      </div>

      {/* Progress Section */}
      {(progress.isRunning || hasStarted) && (
        <div className="space-y-3 mb-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress.total > 0 ? ((progress.completed + progress.failed) / progress.total) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-textColor">
              {progress.completed} {t('media_preloader_success', 'successful')}, {progress.failed} {t('media_preloader_failed', 'failed')}
              {' '}({progress.completed + progress.failed} / {progress.total})
            </div>
            <div className="text-gray-400">
              {Math.round(((progress.completed + progress.failed) / Math.max(progress.total, 1)) * 100)}%
            </div>
          </div>

          {/* Current File */}
          {progress.current && (
            <div className="text-sm text-gray-400">
              {t('media_preloader_processing', 'Processing')}: {progress.current}
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mb-4">
        {!progress.isRunning && !hasStarted && filesToPreload.length > 0 && (
          <Button
            onClick={startPreloading}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {t('media_preloader_start', 'Start Preloading')} ({filesToPreload.length} {t('media_preloader_files', 'files')})
          </Button>
        )}

        {progress.isRunning && (
          <Button
            onClick={stopPreloading}
            secondary={true}
          >
            {t('media_preloader_stop', 'Stop')}
          </Button>
        )}

        {hasStarted && !progress.isRunning && (
          <Button
            onClick={resetPreloader}
            secondary={true}
          >
            {t('media_preloader_reset', 'Reset')}
          </Button>
        )}

        {/* Sync Button */}
        <Button
          onClick={() => syncExternalMedia(productKey)}
          className="!px-3 !py-2 !text-xs"
          disabled={isLoading || progress.isRunning}
          title={t('media_preloader_sync', 'Sync external media first')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          {t('media_preloader_sync', 'Sync')}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-textColor">{mediaStats.totalExternal}</div>
          <div className="text-xs text-gray-400">{t('media_preloader_external', 'External Files')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-500">{mediaStats.totalPreloaded}</div>
          <div className="text-xs text-gray-400">{t('media_preloader_preloaded', 'Preloaded')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-500">{filesToPreload.length}</div>
          <div className="text-xs text-gray-400">{t('media_preloader_pending', 'Pending')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-400">{mediaStats.totalPreloading}</div>
          <div className="text-xs text-gray-400">{t('media_preloader_processing', 'Processing')}</div>
        </div>
      </div>

      {/* Detailed Results */}
      {showDetails && progress.results.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-textColor">
            {t('media_preloader_results', 'Preload Results')}
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {progress.results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between text-xs p-2 rounded ${
                  result.success ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? '✓' : '✗'}
                  <span className="truncate max-w-xs">{result.filename}</span>
                </div>
                {result.error && (
                  <span className="text-xs opacity-75" title={result.error}>
                    {result.error.substring(0, 30)}...
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filesToPreload.length === 0 && !hasStarted && (
        <div className="text-center py-6 text-gray-400">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-sm">
            {t('media_preloader_no_files', 'All available external media has been preloaded.')}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded p-3 text-red-400 text-sm">
          {t('media_preloader_error', 'Failed to load external media: {{error}}', { error })}
        </div>
      )}
    </div>
  );
};