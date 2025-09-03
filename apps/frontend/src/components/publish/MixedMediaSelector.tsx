'use client';

import { FC, useState, useCallback, useMemo } from 'react';
import { Button } from '@gitroom/react/form/button';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { MediaBox } from '@gitroom/frontend/components/media/media.component';
import { ExternalMediaBrowser } from '@gitroom/frontend/components/media/ExternalMediaBrowser';
import { useExternalMedia } from '@gitroom/frontend/hooks/useExternalMedia';
import { Media } from '@prisma/client';
import clsx from 'clsx';

/**
 * Types for Mixed Media Selector
 */
interface MixedMediaItem {
  id: string;
  path: string;
  type: 'uploaded' | 'external';
  isExternal?: boolean;
  name?: string;
  productKey?: string;
  originalPath?: string;
}

interface MixedMediaSelectorProps {
  /** Currently selected media items */
  selectedMedia?: MixedMediaItem[];
  /** Callback when media selection changes */
  onSelectionChange?: (media: MixedMediaItem[]) => void;
  /** Maximum number of media items allowed */
  maxSelection?: number;
  /** Media type filter */
  typeFilter?: 'image' | 'video';
  /** Product filter for external media */
  productFilter?: string;
  /** Whether to show external media by default */
  showExternalByDefault?: boolean;
  /** Whether to show the counter */
  showCounter?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Mixed Media Selector Component
 * 
 * A unified media selector that combines uploaded and external media:
 * - Tabbed interface for uploaded vs external media
 * - Unified selection across both sources
 * - Visual indicators for media source
 * - Drag and drop reordering
 * - Batch selection and management
 * - Integration with existing media workflows
 */
export const MixedMediaSelector: FC<MixedMediaSelectorProps> = ({
  selectedMedia = [],
  onSelectionChange,
  maxSelection = 10,
  typeFilter,
  productFilter,
  showExternalByDefault = false,
  showCounter = true,
  className,
}) => {
  const t = useT();

  const [activeTab, setActiveTab] = useState<'uploaded' | 'external'>(
    showExternalByDefault ? 'external' : 'uploaded'
  );
  const [showMediaBox, setShowMediaBox] = useState(false);

  // External media hook
  const externalMediaHook = useExternalMedia({
    productKey: productFilter,
    type: typeFilter,
  });

  // Convert Media objects to MixedMediaItem
  const convertToMixedMedia = useCallback((
    media: Media[], 
    type: 'uploaded' | 'external' = 'uploaded'
  ): MixedMediaItem[] => {
    return media.map(item => ({
      id: item.id,
      path: item.path,
      type,
      isExternal: type === 'external',
      name: item.path.split('/').pop() || item.id,
    }));
  }, []);

  // Handle uploaded media selection
  const handleUploadedMediaSelect = useCallback((media: { id: string; path: string }[]) => {
    const mixedMedia = media.map(item => ({
      ...item,
      type: 'uploaded' as const,
      isExternal: false,
    }));

    // Merge with current selection, avoiding duplicates
    const currentSelection = selectedMedia.filter(item => item.type === 'external');
    const newSelection = [...currentSelection, ...mixedMedia];

    // Respect max selection limit
    const finalSelection = newSelection.slice(0, maxSelection);

    onSelectionChange?.(finalSelection);
    setShowMediaBox(false);
  }, [selectedMedia, maxSelection, onSelectionChange]);

  // Handle external media selection
  const handleExternalMediaSelect = useCallback((media: Media[]) => {
    const mixedMedia = convertToMixedMedia(media, 'external');

    // Merge with current selection, avoiding duplicates
    const currentSelection = selectedMedia.filter(item => item.type === 'uploaded');
    const newSelection = [...currentSelection, ...mixedMedia];

    // Respect max selection limit
    const finalSelection = newSelection.slice(0, maxSelection);

    onSelectionChange?.(finalSelection);
  }, [selectedMedia, maxSelection, onSelectionChange, convertToMixedMedia]);

  // Handle individual media removal
  const handleRemoveMedia = useCallback((mediaId: string) => {
    const newSelection = selectedMedia.filter(item => item.id !== mediaId);
    onSelectionChange?.(newSelection);
  }, [selectedMedia, onSelectionChange]);

  // Handle clear all selection
  const handleClearAll = useCallback(() => {
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // Count by type
  const selectionStats = useMemo(() => {
    const uploaded = selectedMedia.filter(item => item.type === 'uploaded').length;
    const external = selectedMedia.filter(item => item.type === 'external').length;
    return { uploaded, external, total: uploaded + external };
  }, [selectedMedia]);

  // Check if we can select more items
  const canSelectMore = selectionStats.total < maxSelection;
  const remainingSlots = maxSelection - selectionStats.total;

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Header with tabs and counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('uploaded')}
            className={clsx(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === 'uploaded'
                ? 'bg-forth text-white'
                : 'text-gray-400 hover:text-textColor'
            )}
          >
            {t('mixed_media_uploaded', 'Uploaded')}
            {selectionStats.uploaded > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-forth/20 text-forth text-xs rounded-full">
                {selectionStats.uploaded}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('external')}
            className={clsx(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === 'external'
                ? 'bg-forth text-white'
                : 'text-gray-400 hover:text-textColor'
            )}
          >
            {t('mixed_media_external', 'External')}
            {selectionStats.external > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-forth/20 text-forth text-xs rounded-full">
                {selectionStats.external}
              </span>
            )}
          </button>
        </div>

        {/* Selection counter */}
        {showCounter && (
          <div className="text-sm text-gray-400">
            {selectionStats.total} / {maxSelection} {t('mixed_media_selected', 'selected')}
            {remainingSlots > 0 && (
              <span className="text-green-400 ml-2">
                ({remainingSlots} {t('mixed_media_remaining', 'remaining')})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="bg-newBgColorInner border border-tableBorder rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-textColor">
              {t('mixed_media_selected_title', 'Selected Media')} ({selectedMedia.length})
            </h4>
            <Button
              onClick={handleClearAll}
              className="!px-3 !py-1 !text-xs"
              secondary={true}
            >
              {t('mixed_media_clear_all', 'Clear All')}
            </Button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {selectedMedia.map((media) => (
              <div key={media.id} className="relative group">
                <div className="aspect-square bg-gray-700 rounded border border-tableBorder overflow-hidden">
                  <img
                    src={media.path}
                    alt={media.name || 'Selected media'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Type indicator */}
                  <div className={clsx(
                    'absolute top-1 left-1 px-1 py-0.5 text-xs rounded',
                    media.type === 'external'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                  )}>
                    {media.type === 'external' ? 'EXT' : 'UP'}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveMedia(media.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
                
                {/* Media name */}
                {media.name && (
                  <div className="mt-1 text-xs text-gray-400 truncate" title={media.name}>
                    {media.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-newBgColorInner border border-tableBorder rounded-lg">
        {activeTab === 'uploaded' ? (
          <div className="p-4">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-textColor mb-2">
                {t('mixed_media_select_uploaded', 'Select from Uploaded Media')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('mixed_media_uploaded_desc', 'Choose from your previously uploaded files.')}
              </p>
              
              <Button
                onClick={() => setShowMediaBox(true)}
                disabled={!canSelectMore}
                className="bg-forth hover:bg-forth/90"
              >
                {t('mixed_media_browse_uploaded', 'Browse Uploaded Media')}
              </Button>
              
              {!canSelectMore && (
                <p className="text-sm text-orange-400 mt-2">
                  {t('mixed_media_max_reached', 'Maximum selection reached')}
                </p>
              )}
            </div>

            {/* Media Box Modal */}
            {showMediaBox && (
              <MediaBox
                setMedia={handleUploadedMediaSelect}
                closeModal={() => setShowMediaBox(false)}
                type={typeFilter}
              />
            )}
          </div>
        ) : (
          <div className="h-96">
            <ExternalMediaBrowser
              selectionMode={true}
              multiSelect={true}
              typeFilter={typeFilter}
              productFilter={productFilter}
              onMediaSelect={handleExternalMediaSelect}
              showHeader={false}
              showFilters={true}
              showProductBranding={true}
              maxSelection={remainingSlots}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>
          {t('mixed_media_help_uploaded', '• Uploaded: Files you\'ve previously uploaded to Postiz')}
        </p>
        <p>
          {t('mixed_media_help_external', '• External: Files from connected products and services')}
        </p>
        {maxSelection && (
          <p>
            {t('mixed_media_help_limit', '• You can select up to {{max}} files total', { max: maxSelection })}
          </p>
        )}
      </div>
    </div>
  );
};