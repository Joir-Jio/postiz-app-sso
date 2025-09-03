'use client';

import { FC, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { usePreloadedContent } from '@gitroom/frontend/hooks/usePreloadedContent';
import { ProductBranding } from '@gitroom/frontend/components/branding/ProductBranding';
import { ProductLogo } from '@gitroom/frontend/components/branding/ProductLogo';
import { ExternalMediaBrowser } from '@gitroom/frontend/components/media/ExternalMediaBrowser';
import { MediaPreloader } from '@gitroom/frontend/components/media/MediaPreloader';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Button } from '@gitroom/react/form/button';
import { Media } from '@prisma/client';

/**
 * Types for prefilled form
 */
interface PrefilledFormData {
  content: string;
  upload: Array<{ id: string; path: string }>;
  platforms: string[];
  tags: string[];
  scheduledDate?: Date;
  visibility: 'public' | 'private' | 'unlisted';
  productContext?: {
    productKey: string;
    productName: string;
    sessionId: string;
    originalUrl?: string;
  };
}

interface PrefilledFormProps {
  /** Product key for branding and context */
  productKey?: string;
  /** Initial content hints */
  contentHints?: {
    mediaIds?: string[];
    platforms?: string[];
    contentType?: 'text' | 'image' | 'video' | 'carousel';
    textContent?: string;
    tags?: string[];
  };
  /** Whether to show the preloader */
  showPreloader?: boolean;
  /** Whether to show external media browser */
  showExternalMedia?: boolean;
  /** Callback when form is submitted */
  onSubmit?: (data: PrefilledFormData) => void | Promise<void>;
  /** Callback when form data changes */
  onChange?: (data: Partial<PrefilledFormData>) => void;
  /** Whether the form is in loading state */
  loading?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Prefilled Form Component
 * 
 * A smart publishing form that auto-populates with preloaded content from SSO sessions:
 * - Automatically fills form fields based on SSO context
 * - Integrates external media browser and preloader
 * - Shows product branding and context indicators
 * - Provides seamless publishing experience
 * - Handles mixed media selection (uploaded + external)
 * - Manages product-specific settings and preferences
 */
export const PrefilledForm: FC<PrefilledFormProps> = ({
  productKey,
  contentHints,
  showPreloader = true,
  showExternalMedia = true,
  onSubmit,
  onChange,
  loading = false,
  className,
}) => {
  const t = useT();

  // Preloaded content management
  const {
    isLoading: contentLoading,
    isPreloaded,
    content,
    error: contentError,
    contentStats,
    isReadyToPublish,
    getPrefilledFormData,
    initializePreloadedContent,
  } = usePreloadedContent(productKey, contentHints);

  // Form setup
  const methods = useForm<PrefilledFormData>({
    defaultValues: {
      content: '',
      upload: [],
      platforms: [],
      tags: [],
      visibility: 'public',
    },
  });

  const { watch, setValue, handleSubmit, formState: { isDirty } } = methods;
  const formData = watch();

  // Auto-populate form when preloaded content is available
  useEffect(() => {
    if (isPreloaded && content) {
      const prefilledData = getPrefilledFormData();
      
      // Set form values
      Object.entries(prefilledData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof PrefilledFormData, value, { shouldDirty: false });
        }
      });
    }
  }, [isPreloaded, content, getPrefilledFormData, setValue]);

  // Handle form data changes
  useEffect(() => {
    if (onChange && isDirty) {
      onChange(formData);
    }
  }, [formData, onChange, isDirty]);

  // Handle form submission
  const handleFormSubmit = handleSubmit(async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  });

  // Handle external media selection
  const handleExternalMediaSelect = (media: Media[]) => {
    const currentUpload = formData.upload || [];
    const newMediaItems = media.map(m => ({ id: m.id, path: m.path }));
    
    // Merge with existing uploads, avoiding duplicates
    const mergedUpload = [...currentUpload];
    newMediaItems.forEach(newItem => {
      if (!mergedUpload.some(existing => existing.id === newItem.id)) {
        mergedUpload.push(newItem);
      }
    });
    
    setValue('upload', mergedUpload, { shouldDirty: true });
  };

  // Handle media preload completion
  const handlePreloadComplete = (preloadedMedia: Media[]) => {
    handleExternalMediaSelect(preloadedMedia);
  };

  // Product branding for the form
  const productBranding = useMemo(() => {
    if (!productKey) return undefined;
    return { productKey };
  }, [productKey]);

  return (
    <ProductBranding productKey={productKey}>
      <div className={`space-y-6 ${className || ''}`}>
        {/* Product Context Header */}
        {content?.productContext && (
          <div className="bg-newBgColorInner border border-tableBorder rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ProductLogo
                productKey={content.productContext.productKey}
                size="md"
                className="flex-shrink-0"
              />
              
              <div className="flex-grow">
                <h3 className="font-medium text-textColor">
                  {t('prefilled_form_from_product', 'Publishing from {{product}}', {
                    product: content.productContext.productName
                  })}
                </h3>
                <p className="text-sm text-gray-400">
                  {t('prefilled_form_context_desc', 'Content and settings have been pre-filled based on your session.')}
                </p>
              </div>

              {/* Stats Badge */}
              <div className="text-right">
                <div className="text-sm font-medium text-textColor">
                  {contentStats.mediaCount} {t('prefilled_form_media', 'media')}
                </div>
                <div className="text-xs text-gray-400">
                  {contentStats.connectedPlatforms} {t('prefilled_form_platforms', 'platforms')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Loading State */}
        {contentLoading && (
          <div className="bg-newBgColorInner border border-tableBorder rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forth"></div>
              <div>
                <div className="font-medium text-textColor">
                  {t('prefilled_form_loading', 'Loading your content...')}
                </div>
                <div className="text-sm text-gray-400">
                  {t('prefilled_form_loading_desc', 'Preparing media and settings from your session.')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Error State */}
        {contentError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-red-400">⚠️</div>
              <div>
                <div className="font-medium text-red-400">
                  {t('prefilled_form_error', 'Failed to Load Preloaded Content')}
                </div>
                <div className="text-sm text-red-300">{contentError}</div>
              </div>
              <Button
                onClick={() => initializePreloadedContent(productKey, contentHints)}
                className="!px-3 !py-2 !text-xs bg-red-600 hover:bg-red-700 ml-auto"
              >
                {t('prefilled_form_retry', 'Retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Media Preloader */}
        {showPreloader && productKey && (
          <MediaPreloader
            productKey={productKey}
            showProgress={true}
            autoStart={false}
            onPreloadComplete={handlePreloadComplete}
            showDetails={false}
          />
        )}

        {/* External Media Browser */}
        {showExternalMedia && (
          <div className="bg-newBgColorInner border border-tableBorder rounded-lg p-4">
            <ExternalMediaBrowser
              selectionMode={true}
              multiSelect={true}
              productFilter={productKey}
              onMediaSelect={handleExternalMediaSelect}
              showHeader={true}
              showFilters={true}
              showProductBranding={true}
              maxSelection={10}
            />
          </div>
        )}

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Main Content Area */}
            <div className="bg-newBgColorInner border border-tableBorder rounded-lg p-6">
              <h3 className="font-medium text-textColor mb-4">
                {t('prefilled_form_content_title', 'Content & Media')}
              </h3>

              {/* Content Text Area */}
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-textColor mb-2">
                  {t('prefilled_form_content_label', 'Post Content')}
                </label>
                <textarea
                  id="content"
                  {...methods.register('content')}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-tableBorder rounded-lg text-textColor resize-none focus:ring-2 focus:ring-forth focus:border-transparent"
                  placeholder={t('prefilled_form_content_placeholder', 'What would you like to share?')}
                />
                
                {contentStats.hasTextContent && (
                  <p className="text-xs text-green-400 mt-1">
                    ✓ {t('prefilled_form_content_prefilled', 'Content pre-filled from your session')}
                  </p>
                )}
              </div>

              {/* Media Display */}
              {formData.upload && formData.upload.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-textColor mb-2">
                    {t('prefilled_form_media_label', 'Selected Media')} ({formData.upload.length})
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.upload.slice(0, 8).map((media, index) => (
                      <div key={media.id} className="aspect-square bg-gray-700 rounded border border-tableBorder relative">
                        <img
                          src={media.path}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newUpload = formData.upload.filter(item => item.id !== media.id);
                            setValue('upload', newUpload, { shouldDirty: true });
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.upload.length > 8 && (
                      <div className="aspect-square bg-gray-700 rounded border border-tableBorder flex items-center justify-center">
                        <span className="text-xs text-gray-400">
                          +{formData.upload.length - 8}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Platform Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-textColor mb-2">
                  {t('prefilled_form_platforms_label', 'Publish To')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {content?.userIntegrations?.filter(i => i.connected).map(integration => (
                    <label
                      key={integration.platform}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-tableBorder rounded-lg cursor-pointer hover:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        {...methods.register('platforms')}
                        value={integration.platform}
                        className="rounded"
                      />
                      <span className="text-sm text-textColor capitalize">
                        {integration.platform}
                      </span>
                      {integration.username && (
                        <span className="text-xs text-gray-400">
                          @{integration.username}
                        </span>
                      )}
                    </label>
                  )) || (
                    <p className="text-sm text-gray-400">
                      {t('prefilled_form_no_platforms', 'No connected platforms found.')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Publish Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isReadyToPublish && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {t('prefilled_form_ready', 'Ready to publish')}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  secondary={true}
                  onClick={() => methods.reset()}
                  disabled={!isDirty}
                >
                  {t('prefilled_form_reset', 'Reset')}
                </Button>
                
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!isReadyToPublish}
                  className="bg-forth hover:bg-forth/90"
                >
                  {t('prefilled_form_publish', 'Publish Now')}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </ProductBranding>
  );
};