'use client';

import { FC, useState, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '@gitroom/react/form/button';
import { VideoFrame } from '@gitroom/react/helpers/video.frame';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Media } from '@prisma/client';

/**
 * Types for External Media Card
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

interface ExternalMediaCardProps {
  /** External media file */
  file: ExternalMediaFile;
  /** Whether the file is selected */
  isSelected?: boolean;
  /** Whether the file is currently being preloaded */
  isPreloading?: boolean;
  /** Preloaded media object if available */
  preloadedMedia?: Media | null;
  /** Whether this is in selection mode */
  selectionMode?: boolean;
  /** Whether to show product branding */
  showProductBranding?: boolean;
  /** Click handler for selection */
  onClick?: (file: ExternalMediaFile) => void;
  /** Preload handler */
  onPreload?: (file: ExternalMediaFile) => Promise<void>;
  /** Remove handler */
  onRemove?: (file: ExternalMediaFile) => Promise<void>;
  /** View original handler */
  onViewOriginal?: (file: ExternalMediaFile) => void;
  /** Custom className */
  className?: string;
}

/**
 * External Media Card Component
 * 
 * Displays an external media file with:
 * - Thumbnail preview with fallback
 * - Product branding and context indicators
 * - Preload status and controls
 * - Selection state for multi-select
 * - Metadata display (size, dimensions, etc.)
 * - Action buttons (preload, remove, view)
 * - Accessibility support
 */
export const ExternalMediaCard: FC<ExternalMediaCardProps> = ({
  file,
  isSelected = false,
  isPreloading = false,
  preloadedMedia,
  selectionMode = false,
  showProductBranding = true,
  onClick,
  onPreload,
  onRemove,
  onViewOriginal,
  className,
}) => {
  const t = useT();
  const [imageError, setImageError] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isPreloaded = Boolean(preloadedMedia);
  const isClickable = Boolean(onClick) && (selectionMode || !isPreloaded);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  // Format duration for videos
  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle card click
  const handleClick = useCallback(() => {
    if (isClickable && onClick) {
      onClick(file);
    }
  }, [isClickable, onClick, file]);

  // Handle preload click
  const handlePreload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreload && !isPreloading && !isPreloaded) {
      await onPreload(file);
    }
  }, [onPreload, isPreloading, isPreloaded, file]);

  // Handle remove click
  const handleRemove = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      await onRemove(file);
    }
  }, [onRemove, file]);

  // Handle view original
  const handleViewOriginal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewOriginal) {
      onViewOriginal(file);
    } else {
      window.open(file.url, '_blank');
    }
  }, [onViewOriginal, file]);

  return (
    <div
      className={clsx(
        'relative group bg-newBgColorInner border-2 rounded-lg overflow-hidden transition-all duration-200',
        {
          'border-forth': isSelected,
          'border-tableBorder': !isSelected,
          'cursor-pointer hover:border-gray-500': isClickable,
          'opacity-75': isPreloading,
        },
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${file.type} file: ${file.name}`}
    >
      {/* Selection Indicator */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-20">
          <div
            className={clsx(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              isSelected
                ? 'bg-forth border-forth'
                : 'bg-transparent border-gray-400 hover:border-forth'
            )}
          >
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute top-2 right-2 z-20 flex gap-1">
        {/* Preloaded Indicator */}
        {isPreloaded && (
          <div
            className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1"
            title={t('external_media_preloaded', 'Available in Postiz')}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M8.293 2.293a1 1 0 011.414 1.414L5 8.414 1.293 4.707a1 1 0 111.414-1.414L5 5.586l2.293-2.293z"/>
            </svg>
            <span>{t('external_media_ready', 'Ready')}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {isPreloading && (
          <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1">
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{t('external_media_loading', 'Loading...')}</span>
          </div>
        )}

        {/* Product Badge */}
        {showProductBranding && (
          <div
            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            title={`From ${file.productName}`}
          >
            {file.productKey}
          </div>
        )}
      </div>

      {/* Media Preview */}
      <div className="aspect-square relative bg-gray-800">
        {file.type === 'video' ? (
          <div className="w-full h-full relative">
            <VideoFrame url={file.thumbnail || file.url} />
            
            {/* Video Duration Overlay */}
            {file.metadata?.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {formatDuration(file.metadata.duration)}
              </div>
            )}

            {/* Video Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-black/70 transition-all">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M6.3 2.841A1 1 0 005 3.71v12.58a1 1 0 001.3.869l10-6.29a1 1 0 000-1.738l-10-6.29z"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {!imageError && file.thumbnail ? (
              <Image
                src={file.thumbnail}
                alt={file.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : !imageError && file.url ? (
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <div className="text-center text-gray-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-2">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14.5 17H9zm10-10.5c0 .83-.67 1.5-1.5 1.5S16 7.33 16 6.5 16.67 5 17.5 5 19 5.67 19 6.5z"/>
                  </svg>
                  <div className="text-xs">{t('external_media_no_preview', 'No preview')}</div>
                </div>
              </div>
            )}

            {/* Image Dimensions Overlay */}
            {file.metadata?.width && file.metadata?.height && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {file.metadata.width} × {file.metadata.height}
              </div>
            )}
          </div>
        )}

        {/* Hover Overlay with Actions */}
        {(hovering || isSelected) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all">
            <div className="flex gap-2">
              {/* Preload Button */}
              {!isPreloaded && !isPreloading && onPreload && (
                <Button
                  onClick={handlePreload}
                  className="!px-3 !py-2 !text-xs bg-blue-600 hover:bg-blue-700"
                  title={t('external_media_preload', 'Load into Postiz')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </Button>
              )}

              {/* View Original Button */}
              <Button
                onClick={handleViewOriginal}
                className="!px-3 !py-2 !text-xs bg-gray-600 hover:bg-gray-700"
                title={t('external_media_view_original', 'View original')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </Button>

              {/* Remove Button */}
              {onRemove && (
                <Button
                  onClick={handleRemove}
                  className="!px-3 !py-2 !text-xs bg-red-600 hover:bg-red-700"
                  title={t('external_media_remove', 'Remove from list')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* File Information */}
      <div className="p-3">
        {/* File Name */}
        <h3 className="font-medium text-textColor text-sm truncate mb-1" title={file.name}>
          {file.name}
        </h3>

        {/* File Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            {file.type === 'video' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            )}
            {file.type.toUpperCase()}
          </span>
          <span>{formatFileSize(file.size)}</span>
        </div>

        {/* Creation Date */}
        <div className="text-xs text-gray-500 mt-1">
          {new Date(file.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};