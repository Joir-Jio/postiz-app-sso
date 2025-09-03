'use client';

import { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { Select } from '@gitroom/react/form/select';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useExternalMedia } from '@gitroom/frontend/hooks/useExternalMedia';
import { ExternalMediaCard } from '@gitroom/frontend/components/media/ExternalMediaCard';
import { Pagination } from '@gitroom/frontend/components/media/media.component';
import { Media } from '@prisma/client';
import clsx from 'clsx';

/**
 * Types for External Media Browser
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

interface ExternalMediaBrowserProps {
  /** Whether this is in selection mode */
  selectionMode?: boolean;
  /** Whether to allow multi-select */
  multiSelect?: boolean;
  /** File type filter */
  typeFilter?: 'image' | 'video';
  /** Product filter */
  productFilter?: string;
  /** Selected files */
  selectedFiles?: ExternalMediaFile[];
  /** Selection change handler */
  onSelectionChange?: (files: ExternalMediaFile[]) => void;
  /** Media selection handler for integration with existing media component */
  onMediaSelect?: (media: Media[]) => void;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Whether to show product branding */
  showProductBranding?: boolean;
  /** Custom className */
  className?: string;
  /** Maximum number of files that can be selected */
  maxSelection?: number;
}

/**
 * External Media Browser Component
 * 
 * A comprehensive browser for external media files with:
 * - Grid layout with responsive design
 * - Search and filtering capabilities
 * - Batch operations (preload, select, remove)
 * - Product-based organization
 * - Pagination for large datasets
 * - Integration with existing media workflows
 * - Real-time sync and refresh
 * - Accessibility support
 */
export const ExternalMediaBrowser: FC<ExternalMediaBrowserProps> = ({
  selectionMode = false,
  multiSelect = true,
  typeFilter,
  productFilter,
  selectedFiles = [],
  onSelectionChange,
  onMediaSelect,
  showHeader = true,
  showFilters = true,
  showProductBranding = true,
  className,
  maxSelection = 50,
}) => {
  const t = useT();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(productFilter || '');
  const [selectedType, setSelectedType] = useState<'image' | 'video' | ''>(typeFilter || '');
  const [showOnlyPreloaded, setShowOnlyPreloaded] = useState(false);
  const [localSelectedFiles, setLocalSelectedFiles] = useState<ExternalMediaFile[]>(selectedFiles);

  // External media hook
  const {
    isLoading,
    error,
    externalFiles,
    totalFiles,
    currentPage,
    totalPages,
    preloadingFiles,
    preloadedFiles,
    mediaStats,
    preloadMediaFile,
    batchPreloadFiles,
    removeMediaReference,
    syncExternalMedia,
    isPreloading,
    isPreloaded,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    refresh,
  } = useExternalMedia({
    productKey: selectedProduct || undefined,
    type: selectedType || undefined,
    search: searchQuery || undefined,
    onlyPreloaded: showOnlyPreloaded,
  });

  // Available products from media files
  const availableProducts = useMemo(() => {
    const products = Array.from(new Set(externalFiles.map(file => file.productKey)));
    return products.map(key => ({
      value: key,
      label: key.replace('-', ' ').toUpperCase(),
    }));
  }, [externalFiles]);

  // Handle file selection
  const handleFileSelection = useCallback((file: ExternalMediaFile) => {
    if (!selectionMode) return;

    let newSelection: ExternalMediaFile[];

    if (multiSelect) {
      const isCurrentlySelected = localSelectedFiles.some(f => f.id === file.id);
      if (isCurrentlySelected) {
        newSelection = localSelectedFiles.filter(f => f.id !== file.id);
      } else {
        if (localSelectedFiles.length >= maxSelection) {
          return; // Don't add if max selection reached
        }
        newSelection = [...localSelectedFiles, file];
      }
    } else {
      newSelection = localSelectedFiles.some(f => f.id === file.id) ? [] : [file];
    }

    setLocalSelectedFiles(newSelection);
    onSelectionChange?.(newSelection);
  }, [selectionMode, multiSelect, localSelectedFiles, maxSelection, onSelectionChange]);

  // Handle preload
  const handlePreload = useCallback(async (file: ExternalMediaFile) => {
    await preloadMediaFile(file.originalPath, file.name, file.productKey);
  }, [preloadMediaFile]);

  // Handle batch preload
  const handleBatchPreload = useCallback(async () => {
    const filesToPreload = localSelectedFiles
      .filter(file => !isPreloaded(file.originalPath))
      .map(file => ({
        gcsPath: file.originalPath,
        filename: file.name,
        productKey: file.productKey,
      }));

    if (filesToPreload.length > 0) {
      await batchPreloadFiles(filesToPreload);
      // Clear selection after batch preload
      setLocalSelectedFiles([]);
      onSelectionChange?.([]);
    }
  }, [localSelectedFiles, batchPreloadFiles, isPreloaded, onSelectionChange]);

  // Handle select preloaded for media component
  const handleSelectPreloaded = useCallback(() => {
    if (!onMediaSelect) return;

    const preloadedMediaItems = localSelectedFiles
      .map(file => isPreloaded(file.originalPath))
      .filter(Boolean) as Media[];

    if (preloadedMediaItems.length > 0) {
      onMediaSelect(preloadedMediaItems);
      setLocalSelectedFiles([]);
      onSelectionChange?.([]);
    }
  }, [localSelectedFiles, onMediaSelect, isPreloaded, onSelectionChange]);

  // Handle remove
  const handleRemove = useCallback(async (file: ExternalMediaFile) => {
    // This would need the reference ID, which we'd need from the backend
    // For now, we'll refresh to update the list
    await refresh();
  }, [refresh]);

  // Handle sync
  const handleSync = useCallback(async () => {
    await syncExternalMedia(selectedProduct || undefined);
  }, [syncExternalMedia, selectedProduct]);

  // Clear all selections
  const handleClearSelection = useCallback(() => {
    setLocalSelectedFiles([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // Sync local selection with prop changes
  useEffect(() => {
    setLocalSelectedFiles(selectedFiles);
  }, [selectedFiles]);

  // Check if file is selected
  const isFileSelected = useCallback((file: ExternalMediaFile) => {
    return localSelectedFiles.some(f => f.id === file.id);
  }, [localSelectedFiles]);

  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex-shrink-0 border-b border-tableBorder pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-textColor">
                {t('external_media_title', 'External Media')}
              </h2>
              <p className="text-sm text-gray-400">
                {t('external_media_description', 'Browse and manage media from connected products')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sync Button */}
              <Button
                onClick={handleSync}
                className="!px-3 !py-2 !text-xs bg-blue-600 hover:bg-blue-700"
                loading={isLoading}
                title={t('external_media_sync', 'Sync with external sources')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                </svg>
                {t('external_media_sync', 'Sync')}
              </Button>

              {/* Stats */}
              <div className="text-xs text-gray-400">
                {totalFiles} {t('external_media_files', 'files')} •{' '}
                {mediaStats.totalPreloaded} {t('external_media_preloaded', 'preloaded')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {/* Search */}
          <Input
            label={t('external_media_search', 'Search files...')}
            name="search"
            placeholder={t('external_media_search', 'Search files...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!text-xs"
          />

          {/* Product Filter */}
          <Select
            label={t('external_media_product_filter', 'Product')}
            name="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="!text-xs"
          >
            <option value="">{t('external_media_all_products', 'All Products')}</option>
            {availableProducts.map(product => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
          </Select>

          {/* Type Filter */}
          <Select
            label={t('external_media_type_filter', 'Type')}
            name="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'image' | 'video' | '')}
            className="!text-xs"
          >
            <option value="">{t('external_media_all_types', 'All Types')}</option>
            <option value="image">{t('external_media_images', 'Images')}</option>
            <option value="video">{t('external_media_videos', 'Videos')}</option>
          </Select>

          {/* Preloaded Filter */}
          <label className="flex items-center gap-2 text-xs text-textColor">
            <input
              type="checkbox"
              checked={showOnlyPreloaded}
              onChange={(e) => setShowOnlyPreloaded(e.target.checked)}
              className="rounded"
            />
            {t('external_media_show_preloaded_only', 'Preloaded only')}
          </label>
        </div>
      )}

      {/* Selection Actions */}
      {selectionMode && localSelectedFiles.length > 0 && (
        <div className="flex-shrink-0 flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg mb-4">
          <div className="text-sm text-textColor">
            {localSelectedFiles.length} {t('external_media_selected', 'files selected')}
            {maxSelection && (
              <span className="text-gray-400 ml-2">
                ({maxSelection - localSelectedFiles.length} {t('external_media_remaining', 'remaining')})
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {/* Batch Preload */}
            <Button
              onClick={handleBatchPreload}
              className="!px-3 !py-2 !text-xs bg-blue-600 hover:bg-blue-700"
              disabled={!localSelectedFiles.some(file => !isPreloaded(file.originalPath))}
            >
              {t('external_media_preload_selected', 'Preload Selected')}
            </Button>

            {/* Select Preloaded */}
            {onMediaSelect && (
              <Button
                onClick={handleSelectPreloaded}
                className="!px-3 !py-2 !text-xs bg-green-600 hover:bg-green-700"
                disabled={!localSelectedFiles.some(file => isPreloaded(file.originalPath))}
              >
                {t('external_media_select_preloaded', 'Use Preloaded')}
              </Button>
            )}

            {/* Clear Selection */}
            <Button
              onClick={handleClearSelection}
              className="!px-3 !py-2 !text-xs"
              secondary={true}
            >
              {t('external_media_clear_selection', 'Clear')}
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && externalFiles.length === 0 && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forth mx-auto mb-4"></div>
            <p className="text-gray-400">{t('external_media_loading', 'Loading external media...')}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-textColor mb-2">
              {t('external_media_error_title', 'Failed to Load Media')}
            </h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={refresh}>
              {t('external_media_retry', 'Try Again')}
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && externalFiles.length === 0 && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-textColor mb-2">
              {t('external_media_empty_title', 'No External Media Found')}
            </h3>
            <p className="text-gray-400 mb-4">
              {t('external_media_empty_desc', 'Connect with external products to see your media files here.')}
            </p>
            <Button onClick={handleSync}>
              {t('external_media_sync_now', 'Sync Now')}
            </Button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {!isLoading && !error && externalFiles.length > 0 && (
        <>
          <div className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {externalFiles.map((file) => (
                <ExternalMediaCard
                  key={file.id}
                  file={file}
                  isSelected={isFileSelected(file)}
                  isPreloading={isPreloading(file.originalPath)}
                  preloadedMedia={isPreloaded(file.originalPath)}
                  selectionMode={selectionMode}
                  showProductBranding={showProductBranding}
                  onClick={handleFileSelection}
                  onPreload={handlePreload}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 mt-6">
              <Pagination
                current={currentPage - 1} // Pagination component uses 0-based indexing
                totalPages={totalPages}
                setPage={(page) => goToPage(page + 1)} // Convert back to 1-based
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};