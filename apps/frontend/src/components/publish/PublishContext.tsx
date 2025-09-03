'use client';

import { FC } from 'react';
import { ProductLogo } from '@gitroom/frontend/components/branding/ProductLogo';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * Types for Publishing Context
 */
interface ProductContext {
  productKey: string;
  productName: string;
  sessionId: string;
  originalUrl?: string;
  timestamp?: Date;
}

interface PublishContextProps {
  /** Product context information */
  productContext: ProductContext;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Whether to make it dismissible */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Publish Context Component
 * 
 * Shows context information about where the publishing session originated:
 * - Product branding and information
 * - Session details and timestamp
 * - Original URL reference
 * - Visual context indicators
 * - Dismissible interface
 */
export const PublishContext: FC<PublishContextProps> = ({
  productContext,
  showDetails = true,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const t = useT();

  const { productKey, productName, sessionId, originalUrl, timestamp } = productContext;

  return (
    <div className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-4 ${className || ''}`}>
      <div className="flex items-center gap-4">
        {/* Product Logo */}
        <div className="flex-shrink-0">
          <ProductLogo
            productKey={productKey}
            size="md"
            className="ring-2 ring-blue-500/30 rounded-lg"
          />
        </div>

        {/* Context Information */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-textColor">
              {t('publish_context_from', 'Publishing from {{product}}', { product: productName })}
            </h3>
            <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {t('publish_context_sso', 'SSO')}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-2">
            {t('publish_context_desc', 'Content and settings have been automatically configured based on your session.')}
          </p>

          {/* Detailed Information */}
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              {/* Session ID */}
              <div>
                <span className="font-medium text-gray-400">
                  {t('publish_context_session', 'Session:')}
                </span>
                <div className="font-mono truncate" title={sessionId}>
                  {sessionId.substring(0, 12)}...
                </div>
              </div>

              {/* Timestamp */}
              {timestamp && (
                <div>
                  <span className="font-medium text-gray-400">
                    {t('publish_context_time', 'Started:')}
                  </span>
                  <div>{timestamp.toLocaleTimeString()}</div>
                </div>
              )}

              {/* Original URL */}
              {originalUrl && (
                <div>
                  <span className="font-medium text-gray-400">
                    {t('publish_context_source', 'Source:')}
                  </span>
                  <div className="truncate">
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title={originalUrl}
                    >
                      {new URL(originalUrl).hostname}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-textColor transition-colors"
            title={t('publish_context_dismiss', 'Dismiss')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};