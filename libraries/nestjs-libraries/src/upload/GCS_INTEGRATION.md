# Google Cloud Storage Integration for Postiz

This comprehensive GCS integration provides seamless file storage and referencing capabilities for Postiz's multi-product SSO system. It allows external products to reference their existing files in GCS without re-uploading, while maintaining security and performance.

## Features

### Core Capabilities
- **Zero-Upload File Referencing**: Reference existing GCS files without re-uploading
- **Intelligent Path Resolution**: Support for various user folder patterns (with/without DEV suffixes)
- **Advanced Security**: Path validation, access control, and traversal attack prevention
- **Performance Optimization**: Intelligent caching, connection pooling, and retry logic
- **Flexible Authentication**: Support for service account keys, credential objects, and ADC
- **Comprehensive Error Handling**: Graceful error handling with detailed logging

### File Reference System
- Generate metadata without downloading full files
- Create signed URLs for secure file access
- Support streaming for large files
- Handle different mime types appropriately
- Track file access and usage patterns

### Performance Features
- **Intelligent Caching**: Path resolution, metadata, and file info caching
- **Connection Pooling**: Efficient GCS API connection management
- **Retry Logic**: Exponential backoff with jitter for resilient operations
- **Rate Limiting**: Built-in rate limiting and request throttling
- **Memory Management**: LRU cache eviction and memory optimization

## Installation

First, install the required Google Cloud Storage dependency:

```bash
pnpm add @google-cloud/storage
```

## Configuration

### Environment Variables

Set these environment variables to configure GCS integration:

```bash
# Required Configuration
STORAGE_PROVIDER=gcs
GCS_PROJECT_ID=your-gcs-project-id
GCS_BUCKET_NAME=your-bucket-name

# Authentication (choose one method)
# Method 1: Service Account Key File
GCS_KEY_FILENAME=/path/to/service-account-key.json

# Method 2: Service Account Credentials (JSON string)
GCS_CREDENTIALS='{"client_email":"...","private_key":"..."}'

# Method 3: Application Default Credentials (set this environment variable)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Optional Configuration
GCS_REGION=us-central1
GCS_PUBLIC_BASE_URL=https://cdn.yoursite.com

# File Reference Settings
GCS_ALLOW_FILE_REFERENCE=true
GCS_ALLOWED_PATH_PATTERNS='["^[a-zA-Z0-9_-]+-bucket/[a-zA-Z0-9_-]+(-DEV)?/\\\\d+/[^/]+\\\\.[a-zA-Z0-9]+$"]'
GCS_MAX_FILE_SIZE=524288000  # 500MB in bytes
GCS_SIGNED_URL_EXPIRY=3600   # 1 hour in seconds

# Performance Settings
GCS_ENABLE_CACHING=true
GCS_CACHE_MAX_AGE=86400      # 1 day in seconds
GCS_MAX_RETRIES=5
GCS_REQUEST_TIMEOUT=60000    # 1 minute in milliseconds
```

### Programmatic Configuration

You can also configure GCS storage programmatically:

```typescript
import { GCSStorage, GCSConfiguration, DEFAULT_CONFIGS } from '@gitroom/nestjs-libraries/src/upload/gcs.storage';

// Development Configuration
const devConfig: GCSConfiguration = {
  projectId: 'my-project',
  bucketName: 'my-bucket',
  keyFilename: '/path/to/dev-key.json',
  ...DEFAULT_CONFIGS.DEVELOPMENT,
};

// Production Configuration
const prodConfig: GCSConfiguration = {
  projectId: 'my-project',
  bucketName: 'my-prod-bucket',
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL!,
    private_key: process.env.GCS_PRIVATE_KEY!,
  },
  ...DEFAULT_CONFIGS.PRODUCTION,
};

// High-Performance Configuration
const perfConfig: GCSConfiguration = {
  projectId: 'my-project',
  bucketName: 'my-large-files-bucket',
  keyFilename: '/path/to/perf-key.json',
  ...DEFAULT_CONFIGS.HIGH_PERFORMANCE,
};

const storage = new GCSStorage(prodConfig);
```

## Usage Examples

### Basic File Upload

```typescript
import { UploadFactory } from '@gitroom/nestjs-libraries/src/upload/upload.factory';

const storage = UploadFactory.createStorage();

// Upload a file
const multerFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'document.pdf',
  mimetype: 'application/pdf',
  buffer: fileBuffer,
  size: fileBuffer.length,
  // ... other multer properties
};

const result = await storage.uploadFile(multerFile);
console.log('File uploaded:', result.path);
```

### File Referencing (Zero-Upload)

```typescript
import { GCSStorage } from '@gitroom/nestjs-libraries/src/upload/gcs.storage';

const gcsStorage = storage as GCSStorage;

// Reference existing file in GCS
const fileReference = await gcsStorage.referenceFile({
  filePath: 'hyperhusk01-result-bucket/K7mN9pQx2R-DEV/1/video.mp4',
  userId: 'K7mN9pQx2R',
  validatePath: true,
});

console.log('File referenced:', fileReference.path);
console.log('Signed URL:', fileReference.path);
console.log('Is reference:', fileReference.isReference); // true
```

### File Information and Metadata

```typescript
// Check if file exists
const exists = await gcsStorage.fileExists('path/to/file.jpg');
console.log('File exists:', exists);

// Get file metadata
const metadata = await gcsStorage.getFileInfo('path/to/file.jpg', 'userId');
console.log('File info:', {
  name: metadata.name,
  size: metadata.size,
  contentType: metadata.contentType,
  lastModified: metadata.lastModified,
  signedUrl: metadata.signedUrl,
});

// List files in directory
const files = await gcsStorage.listFiles('hyperhusk01-result-bucket/user123', 'user123');
files.forEach(file => {
  console.log(`${file.name}: ${file.size} bytes`);
});
```

### Cache Management

```typescript
// Get cache statistics
const cacheStats = gcsStorage.getCacheStats();
console.log('Cache stats:', cacheStats);

// Clear all caches
gcsStorage.clearCaches();

// Get configuration (safe, excluding sensitive data)
const config = gcsStorage.getConfig();
console.log('Current config:', config);
```

## Path Patterns

The system supports flexible path patterns to accommodate different file organization strategies:

### Supported Patterns

1. **User Bucket with Environment**: `hyperhusk01-result-bucket/K7mN9pQx2R-DEV/1/video.mp4`
2. **Simple User Bucket**: `hyperhusk01-result-bucket/62152016094/image.jpg`
3. **Flat Structure**: `hyperhusk01-result-bucket/document.pdf`
4. **Deep Organization**: `project-bucket/users/2024/01/15/file.jpg`

### Custom Patterns

Define custom path patterns using regular expressions:

```typescript
const customPatterns = [
  // Company bucket with user and project structure
  '^company-bucket/users/[a-zA-Z0-9_-]+/projects/[a-zA-Z0-9_-]+/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Date-organized structure
  '^media-bucket/\\d{4}/\\d{2}/\\d{2}/[a-zA-Z0-9_-]+/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Department-based organization
  '^corporate-bucket/(marketing|sales|dev|design)/[a-zA-Z0-9_-]+/[^/]+\\.[a-zA-Z0-9]+$',
];

const storage = new GCSStorage({
  // ... other config
  allowedPathPatterns: customPatterns,
});
```

## Security Features

### Path Validation
- **Path Traversal Protection**: Automatically detects and blocks `../` attacks
- **Pattern Matching**: Enforces allowed path patterns to prevent unauthorized access
- **User Validation**: Ensures users can only access their own files
- **Sanitization**: Normalizes paths and removes dangerous characters

### Access Control
- **User-Based Permissions**: Validate user access to specific paths
- **Environment Separation**: Support for DEV/PROD environment isolation
- **Signed URLs**: Generate time-limited signed URLs for secure access
- **File Size Limits**: Configurable file size limits to prevent abuse

### Example Security Configuration

```typescript
const secureConfig: GCSConfiguration = {
  projectId: 'secure-project',
  bucketName: 'secure-bucket',
  
  // Strict path patterns
  allowedPathPatterns: [
    '^secure-bucket/users/[a-zA-Z0-9_-]+/[^/]+\\.[a-zA-Z0-9]+$'
  ],
  
  // Conservative limits
  maxFileSize: 50 * 1024 * 1024, // 50MB
  signedUrlExpiry: 900, // 15 minutes
  
  // Enable all security features
  allowFileReference: true,
};
```

## Performance Optimization

### Caching Strategy

The system implements multi-level caching:

1. **Path Validation Cache**: Caches path validation results (5 minutes TTL)
2. **Metadata Cache**: Caches file metadata (2 minutes TTL)
3. **LRU Eviction**: Automatically evicts least recently used items

### Connection Management

- **Connection Pooling**: Reuses GCS client connections
- **Request Timeout**: Configurable timeouts prevent hanging requests
- **Retry Logic**: Exponential backoff with jitter for failed requests

### Monitoring

```typescript
import { GCSPerformanceMonitor } from '@gitroom/nestjs-libraries/src/upload/gcs.utils';

const monitor = new GCSPerformanceMonitor();

// Track operations
const result = await monitor.trackOperation('file-upload', async () => {
  return await storage.uploadFile(file);
});

// Get performance statistics
const stats = monitor.getStats();
console.log('Performance stats:', stats);
// Output: { 'file-upload': { count: 10, avgTime: 1250, errorRate: 0.1 } }
```

## Error Handling

The system provides comprehensive error handling with detailed error messages:

### Common Error Scenarios

```typescript
try {
  await gcsStorage.referenceFile({
    filePath: 'invalid-path',
    userId: 'user123',
  });
} catch (error) {
  if (error.message.includes('Invalid file path')) {
    // Handle path validation error
  } else if (error.message.includes('File does not exist')) {
    // Handle missing file error
  } else if (error.message.includes('File too large')) {
    // Handle file size limit error
  }
}
```

### Error Types

- **Configuration Errors**: Invalid GCS configuration
- **Authentication Errors**: Invalid credentials or permissions
- **Path Validation Errors**: Invalid or unauthorized file paths
- **File Access Errors**: File not found or access denied
- **Size Limit Errors**: File exceeds configured size limits
- **Network Errors**: GCS API connectivity issues

## Integration with Postiz Controllers

### Media Controller Integration

```typescript
import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFactory } from '@gitroom/nestjs-libraries/src/upload/upload.factory';
import { GCSStorage } from '@gitroom/nestjs-libraries/src/upload/gcs.storage';

@Controller('media')
export class MediaController {
  private readonly storage = UploadFactory.createStorage();

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.storage.uploadFile(file);
  }

  @Post('reference')
  async referenceFile(@Body() body: { filePath: string; userId: string }) {
    if (this.storage instanceof GCSStorage) {
      return await this.storage.referenceFile({
        filePath: body.filePath,
        userId: body.userId,
      });
    }
    throw new Error('File referencing not supported with current storage provider');
  }
}
```

### User-Specific File Access

```typescript
@Controller('user-files')
export class UserFilesController {
  private readonly storage = UploadFactory.createStorage();

  @Get(':userId/files')
  async getUserFiles(@Param('userId') userId: string) {
    if (this.storage instanceof GCSStorage) {
      const files = await this.storage.listFiles(
        `user-bucket/${userId}`,
        userId,
        50 // Max 50 files
      );
      return files;
    }
    throw new Error('File listing not supported');
  }

  @Get(':userId/file-info')
  async getFileInfo(
    @Param('userId') userId: string,
    @Query('path') filePath: string
  ) {
    if (this.storage instanceof GCSStorage) {
      return await this.storage.getFileInfo(filePath, userId);
    }
    throw new Error('File info not supported');
  }
}
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
pnpm test libraries/nestjs-libraries/src/upload/gcs.storage.spec.ts

# Run with coverage
pnpm test --coverage libraries/nestjs-libraries/src/upload/gcs.storage.spec.ts

# Run specific test suites
pnpm test --testNamePattern="Path Validation"
pnpm test --testNamePattern="File Reference"
pnpm test --testNamePattern="Caching"
```

## Production Deployment

### Service Account Setup

1. **Create Service Account**:
   ```bash
   gcloud iam service-accounts create postiz-storage \
     --display-name="Postiz Storage Service Account"
   ```

2. **Grant Permissions**:
   ```bash
   gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
     --member="serviceAccount:postiz-storage@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
     --role="roles/storage.objectAdmin"
   ```

3. **Create and Download Key**:
   ```bash
   gcloud iam service-accounts keys create postiz-storage-key.json \
     --iam-account=postiz-storage@YOUR-PROJECT-ID.iam.gserviceaccount.com
   ```

### Environment Configuration

```bash
# Production environment variables
STORAGE_PROVIDER=gcs
GCS_PROJECT_ID=your-production-project
GCS_BUCKET_NAME=postiz-prod-storage
GCS_KEY_FILENAME=/secure/path/postiz-storage-key.json
GCS_REGION=us-central1
GCS_ALLOW_FILE_REFERENCE=true
GCS_MAX_FILE_SIZE=524288000  # 500MB
GCS_SIGNED_URL_EXPIRY=3600   # 1 hour
GCS_ENABLE_CACHING=true
GCS_CACHE_MAX_AGE=86400      # 1 day
GCS_MAX_RETRIES=5
GCS_REQUEST_TIMEOUT=60000    # 1 minute
```

### Monitoring and Alerting

Set up monitoring for:
- **File Upload/Reference Success Rate**
- **API Response Times**
- **Error Rates**
- **Cache Hit Rates**
- **Storage Costs**

## Cost Optimization

### Best Practices

1. **Use Signed URLs**: Reduce bandwidth costs by serving files directly from GCS
2. **Implement Caching**: Reduce API calls with intelligent caching
3. **Choose Appropriate Storage Class**: Use Nearline/Coldline for archival data
4. **Monitor Usage**: Track storage usage and costs regularly
5. **Lifecycle Policies**: Automatically move or delete old files

### Cost Monitoring

```typescript
// Example: Track file reference vs upload costs
const stats = gcsStorage.getCacheStats();
const referencedFiles = stats.metadataCache; // Files referenced from cache
const uploadedFiles = await getUploadCount(); // From your metrics

console.log(`Reference ratio: ${referencedFiles / (referencedFiles + uploadedFiles * 100)}%`);
console.log('Estimated cost savings from file referencing:', estimatedSavings);
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify service account key path
   - Check IAM permissions
   - Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly

2. **Path Validation Failures**:
   - Check allowed path patterns
   - Verify file path format
   - Ensure user ID matches path

3. **File Not Found**:
   - Verify bucket name and file path
   - Check file existence in GCS Console
   - Validate path case sensitivity

4. **Performance Issues**:
   - Enable caching
   - Increase request timeout
   - Check network connectivity to GCS

### Debug Mode

Enable debug logging:

```bash
DEBUG=gcs:* node your-app.js
```

Or programmatically:

```typescript
const storage = new GCSStorage({
  // ... config
  debug: true, // Enable debug logging
});
```

## Migration from Other Storage Providers

### From Local Storage

```typescript
// Before (Local)
const localStorage = new LocalStorage('/uploads');

// After (GCS)
const gcsStorage = new GCSStorage({
  projectId: 'your-project',
  bucketName: 'your-bucket',
  // ... other config
});
```

### From Cloudflare R2

```typescript
// Before (Cloudflare)
const cloudflareStorage = new CloudflareStorage(/* config */);

// After (GCS with similar performance)
const gcsStorage = new GCSStorage({
  // ... basic config
  ...DEFAULT_CONFIGS.HIGH_PERFORMANCE,
});
```

## Support and Contributing

For issues, feature requests, or contributions:

1. Check existing issues in the repository
2. Create detailed bug reports with configuration and error logs
3. Submit feature requests with use cases and examples
4. Follow the contribution guidelines for pull requests

## License

This GCS integration follows the same license as the Postiz project: AGPL-3.0.