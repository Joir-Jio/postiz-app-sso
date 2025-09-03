import { GCSStorage, GCSConfiguration } from './gcs.storage';
import { GCSPathResolver, GCSCacheManager, GCSUtils } from './gcs.utils';
import { GCSConfigValidator, DEFAULT_CONFIGS } from './gcs.types';
import { Storage, Bucket, File } from '@google-cloud/storage';

// Mock Google Cloud Storage
jest.mock('@google-cloud/storage');

describe('GCSStorage', () => {
  let mockStorage: jest.Mocked<Storage>;
  let mockBucket: jest.Mocked<Bucket>;
  let mockFile: jest.Mocked<File>;
  let gcsStorage: GCSStorage;
  let config: GCSConfiguration;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mocked instances
    mockFile = {
      getMetadata: jest.fn(),
      exists: jest.fn(),
      getSignedUrl: jest.fn(),
      createWriteStream: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
      getFiles: jest.fn(),
    } as any;

    mockStorage = {
      bucket: jest.fn().mockReturnValue(mockBucket),
    } as any;

    // Mock the Storage constructor
    (Storage as jest.MockedClass<typeof Storage>).mockImplementation(() => mockStorage);

    // Test configuration
    config = {
      projectId: 'test-project',
      bucketName: 'test-bucket',
      allowFileReference: true,
      allowedPathPatterns: [
        '^test-bucket/[a-zA-Z0-9_-]+(-DEV)?/\\d+/[^/]+\\.[a-zA-Z0-9]+$'
      ],
      maxFileSize: 100 * 1024 * 1024, // 100MB
      signedUrlExpiry: 3600,
      enableCaching: true,
      maxRetries: 3,
      requestTimeout: 30000,
    };

    gcsStorage = new GCSStorage(config);
  });

  describe('Configuration', () => {
    it('should validate valid configuration', () => {
      const validation = GCSConfigValidator.validateConfig(config);
      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.projectId).toBe('test-project');
        expect(validation.data.bucketName).toBe('test-bucket');
      }
    });

    it('should reject invalid configuration', () => {
      const invalidConfig = { ...config, projectId: '' };
      const validation = GCSConfigValidator.validateConfig(invalidConfig);
      expect(validation.success).toBe(false);
      if (!validation.success) {
        expect(validation.errors.length).toBeGreaterThan(0);
      }
    });

    it('should use default values for optional configuration', () => {
      const minimalConfig = {
        projectId: 'test-project',
        bucketName: 'test-bucket',
      };
      const validation = GCSConfigValidator.validateConfig(minimalConfig);
      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.maxRetries).toBe(3);
        expect(validation.data.enableCaching).toBe(true);
      }
    });
  });

  describe('File Reference', () => {
    beforeEach(() => {
      mockFile.exists.mockResolvedValue([true]);
      mockFile.getMetadata.mockResolvedValue([{
        name: 'test-file.jpg',
        size: '1024',
        contentType: 'image/jpeg',
        updated: new Date().toISOString(),
        etag: 'test-etag',
      }]);
      mockFile.getSignedUrl.mockResolvedValue(['https://signed-url.example.com']);
    });

    it('should reference existing file successfully', async () => {
      const options = {
        filePath: 'test-bucket/user123/1/test-file.jpg',
        userId: 'user123',
      };

      const result = await gcsStorage.referenceFile(options);

      expect(result).toBeDefined();
      expect(result.isReference).toBe(true);
      expect(result.filename).toBe('test-file.jpg');
      expect(result.path).toBe('https://signed-url.example.com');
      expect(result.gcsPath).toBe('test-bucket/user123/1/test-file.jpg');
      
      expect(mockFile.exists).toHaveBeenCalled();
      expect(mockFile.getMetadata).toHaveBeenCalled();
      expect(mockFile.getSignedUrl).toHaveBeenCalled();
    });

    it('should validate path patterns', async () => {
      const options = {
        filePath: 'invalid-path/file.jpg',
        userId: 'user123',
      };

      await expect(gcsStorage.referenceFile(options)).rejects.toThrow('Invalid file path');
    });

    it('should reject non-existent files', async () => {
      mockFile.exists.mockResolvedValue([false]);
      
      const options = {
        filePath: 'test-bucket/user123/1/non-existent.jpg',
        userId: 'user123',
      };

      await expect(gcsStorage.referenceFile(options)).rejects.toThrow('File does not exist');
    });

    it('should check file size limits', async () => {
      mockFile.getMetadata.mockResolvedValue([{
        name: 'large-file.jpg',
        size: (200 * 1024 * 1024).toString(), // 200MB - exceeds 100MB limit
        contentType: 'image/jpeg',
        updated: new Date().toISOString(),
        etag: 'test-etag',
      }]);

      const options = {
        filePath: 'test-bucket/user123/1/large-file.jpg',
        userId: 'user123',
      };

      await expect(gcsStorage.referenceFile(options)).rejects.toThrow('File too large');
    });
  });

  describe('File Upload', () => {
    let mockWriteStream: any;

    beforeEach(() => {
      mockWriteStream = {
        on: jest.fn(),
        end: jest.fn(),
      };
      mockFile.createWriteStream.mockReturnValue(mockWriteStream);
    });

    it('should upload file successfully', async () => {
      // Mock successful upload
      mockWriteStream.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'finish') {
          setTimeout(callback, 10);
        }
        return mockWriteStream;
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test file content'),
        destination: '',
        filename: '',
        path: '',
        stream: null as any,
      };

      const result = await gcsStorage.uploadFile(mockFile);

      expect(result).toBeDefined();
      expect(result.mimetype).toBe('image/jpeg');
      expect(result.size).toBe(1024);
      expect(result.path).toContain('https://storage.googleapis.com');
      expect(result.isReference).toBe(false);
      
      expect(mockFile.createWriteStream).toHaveBeenCalled();
    });

    it('should handle upload errors', async () => {
      // Mock upload error
      mockWriteStream.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'error') {
          setTimeout(() => callback(new Error('Upload failed')), 10);
        }
        return mockWriteStream;
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test file content'),
        destination: '',
        filename: '',
        path: '',
        stream: null as any,
      };

      await expect(gcsStorage.uploadFile(mockFile)).rejects.toThrow('Failed to upload file');
    });
  });

  describe('File Operations', () => {
    beforeEach(() => {
      mockFile.exists.mockResolvedValue([true]);
      mockFile.delete.mockResolvedValue([{}]);
    });

    it('should remove file successfully', async () => {
      await gcsStorage.removeFile('test-file.jpg');
      
      expect(mockBucket.file).toHaveBeenCalledWith('test-file.jpg');
      expect(mockFile.delete).toHaveBeenCalled();
    });

    it('should handle file removal errors gracefully', async () => {
      mockFile.delete.mockRejectedValue(new Error('Delete failed'));
      
      // Should not throw error
      await expect(gcsStorage.removeFile('test-file.jpg')).resolves.not.toThrow();
    });

    it('should check file existence', async () => {
      const exists = await gcsStorage.fileExists('test-bucket/user123/1/test.jpg');
      expect(exists).toBe(true);
      expect(mockFile.exists).toHaveBeenCalled();
    });

    it('should get file info', async () => {
      mockFile.getMetadata.mockResolvedValue([{
        name: 'test.jpg',
        size: '1024',
        contentType: 'image/jpeg',
        updated: new Date().toISOString(),
        etag: 'test-etag',
      }]);
      mockFile.getSignedUrl.mockResolvedValue(['https://signed-url.example.com']);

      const info = await gcsStorage.getFileInfo('test-bucket/user123/1/test.jpg', 'user123');
      
      expect(info.exists).toBe(true);
      expect(info.name).toBe('test.jpg');
      expect(info.size).toBe(1024);
      expect(info.signedUrl).toBe('https://signed-url.example.com');
    });

    it('should list files', async () => {
      const mockFiles = [{
        getMetadata: jest.fn().mockResolvedValue([{
          name: 'file1.jpg',
          size: '1024',
          contentType: 'image/jpeg',
          updated: new Date().toISOString(),
          etag: 'etag1',
        }])
      }, {
        getMetadata: jest.fn().mockResolvedValue([{
          name: 'file2.jpg',
          size: '2048',
          contentType: 'image/jpeg',
          updated: new Date().toISOString(),
          etag: 'etag2',
        }])
      }];
      
      mockBucket.getFiles.mockResolvedValue([mockFiles as any]);

      const files = await gcsStorage.listFiles('test-bucket/user123', 'user123');
      
      expect(files).toHaveLength(2);
      expect(files[0].name).toBe('file1.jpg');
      expect(files[1].name).toBe('file2.jpg');
    });
  });

  describe('Caching', () => {
    it('should cache path validation results', async () => {
      const pathResolver = new GCSPathResolver(['.*'], true);
      
      // First call
      const result1 = pathResolver.validatePath('test-bucket/user123/1/test.jpg', 'user123');
      
      // Second call (should use cache)
      const result2 = pathResolver.validatePath('test-bucket/user123/1/test.jpg', 'user123');
      
      expect(result1.isValid).toBe(result2.isValid);
      expect(result1.sanitizedPath).toBe(result2.sanitizedPath);
      
      const stats = pathResolver.getStats();
      expect(stats.cache.size).toBeGreaterThan(0);
      
      pathResolver.destroy();
    });

    it('should manage cache size and TTL', async () => {
      const cache = new GCSCacheManager<string>(1000, 5); // 1 second TTL, max 5 items
      
      // Add items to cache
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      expect(cache.has('key1')).toBe(true);
      expect(cache.get('key1')).toBe('value1');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(cache.has('key1')).toBe(false);
      expect(cache.get('key1')).toBe(null);
      
      cache.clear();
      expect(cache.getStats().size).toBe(0);
    });

    it('should clear caches', () => {
      gcsStorage.clearCaches();
      
      const stats = gcsStorage.getCacheStats();
      expect(stats.pathCache).toBe(0);
      expect(stats.metadataCache).toBe(0);
    });
  });
});

describe('GCSPathResolver', () => {
  let pathResolver: GCSPathResolver;

  beforeEach(() => {
    pathResolver = new GCSPathResolver([
      '^test-bucket/[a-zA-Z0-9_-]+(-DEV)?/\\d+/[^/]+\\.[a-zA-Z0-9]+$'
    ], false); // Disable caching for testing
  });

  afterEach(() => {
    pathResolver.destroy();
  });

  describe('Path Validation', () => {
    it('should validate valid paths', () => {
      const testPaths = [
        'test-bucket/user123/1/file.jpg',
        'test-bucket/user123-DEV/1/file.mp4',
        'test-bucket/abc_def/999/document.pdf',
      ];

      testPaths.forEach(path => {
        const result = pathResolver.validatePath(path);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedPath).toBe(path);
      });
    });

    it('should reject invalid paths', () => {
      const testPaths = [
        'invalid/path',
        'test-bucket/../../../etc/passwd',
        'test-bucket//double/slash',
        '',
        'test-bucket/user123/file.jpg', // Missing number folder
      ];

      testPaths.forEach(path => {
        const result = pathResolver.validatePath(path);
        expect(result.isValid).toBe(false);
        expect(result.errors!.length).toBeGreaterThan(0);
      });
    });

    it('should detect path traversal attempts', () => {
      const maliciousPaths = [
        'test-bucket/../../../secret.txt',
        'test-bucket/user/../admin/file.jpg',
        'test-bucket/user123/1/..\\..\\windows\\system32\\file.exe',
      ];

      maliciousPaths.forEach(path => {
        const result = pathResolver.validatePath(path);
        expect(result.isValid).toBe(false);
        expect(result.errors!.some(err => err.includes('traversal'))).toBe(true);
      });
    });

    it('should normalize paths correctly', () => {
      const testCases = [
        {
          input: '/test-bucket/user123/1/file.jpg/',
          expected: 'test-bucket/user123/1/file.jpg'
        },
        {
          input: 'test-bucket\\user123\\1\\file.jpg',
          expected: 'test-bucket/user123/1/file.jpg'
        },
        {
          input: 'test-bucket//user123///1//file.jpg',
          expected: 'test-bucket/user123/1/file.jpg'
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = pathResolver.validatePath(input);
        if (result.isValid) {
          expect(result.sanitizedPath).toBe(expected);
        }
      });
    });
  });

  describe('User Info Extraction', () => {
    it('should extract user information correctly', () => {
      const testCases = [
        {
          path: 'test-bucket/user123/1/file.jpg',
          expected: { userId: 'user123', isDev: false, environment: 'prod' }
        },
        {
          path: 'test-bucket/user123-DEV/1/file.jpg',
          expected: { userId: 'user123', isDev: true, environment: 'dev' }
        },
        {
          path: 'test-bucket/abc_def-DEV/999/file.jpg',
          expected: { userId: 'abc_def', isDev: true, environment: 'dev' }
        },
      ];

      testCases.forEach(({ path, expected }) => {
        const userInfo = pathResolver.extractUserInfo(path);
        expect(userInfo.userId).toBe(expected.userId);
        expect(userInfo.isDev).toBe(expected.isDev);
        expect(userInfo.environment).toBe(expected.environment);
      });
    });
  });

  describe('Pattern Matching', () => {
    it('should match allowed patterns', () => {
      const validPath = 'test-bucket/user123/1/file.jpg';
      const result = pathResolver.matchesAllowedPatterns(validPath);
      
      expect(result.matches).toBe(true);
      expect(result.matchedPattern).toBeDefined();
    });

    it('should reject paths that do not match patterns', () => {
      const invalidPath = 'wrong-format/file.jpg';
      const result = pathResolver.matchesAllowedPatterns(invalidPath);
      
      expect(result.matches).toBe(false);
      expect(result.matchedPattern).toBeUndefined();
    });
  });
});

describe('GCSUtils', () => {
  describe('File Extensions', () => {
    it('should extract extensions from filenames', () => {
      expect(GCSUtils.getFileExtension(undefined, 'test.jpg')).toBe('jpg');
      expect(GCSUtils.getFileExtension(undefined, 'document.pdf')).toBe('pdf');
      expect(GCSUtils.getFileExtension(undefined, 'file.tar.gz')).toBe('gz');
    });

    it('should extract extensions from content types', () => {
      expect(GCSUtils.getFileExtension('image/jpeg')).toBe('jpg');
      expect(GCSUtils.getFileExtension('application/pdf')).toBe('pdf');
      expect(GCSUtils.getFileExtension('video/mp4')).toBe('mp4');
    });

    it('should fallback to bin for unknown types', () => {
      expect(GCSUtils.getFileExtension('unknown/type')).toBe('bin');
      expect(GCSUtils.getFileExtension()).toBe('bin');
    });
  });

  describe('File Size Validation', () => {
    it('should validate file sizes correctly', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      expect(GCSUtils.validateFileSize(5 * 1024 * 1024, maxSize).valid).toBe(true);
      expect(GCSUtils.validateFileSize(15 * 1024 * 1024, maxSize).valid).toBe(false);
      expect(GCSUtils.validateFileSize(15 * 1024 * 1024, maxSize).error).toContain('exceeds');
    });

    it('should format bytes correctly', () => {
      expect(GCSUtils.formatBytes(1024)).toBe('1 KB');
      expect(GCSUtils.formatBytes(1024 * 1024)).toBe('1 MB');
      expect(GCSUtils.formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(GCSUtils.formatBytes(0)).toBe('0 Bytes');
    });
  });

  describe('File Type Support', () => {
    it('should check supported file types', () => {
      const allowedTypes = ['image/*', 'application/pdf'];
      
      expect(GCSUtils.isSupportedFileType('image/jpeg', allowedTypes)).toBe(true);
      expect(GCSUtils.isSupportedFileType('image/png', allowedTypes)).toBe(true);
      expect(GCSUtils.isSupportedFileType('application/pdf', allowedTypes)).toBe(true);
      expect(GCSUtils.isSupportedFileType('video/mp4', allowedTypes)).toBe(false);
    });

    it('should allow all types when no restrictions', () => {
      expect(GCSUtils.isSupportedFileType('any/type')).toBe(true);
      expect(GCSUtils.isSupportedFileType('any/type', [])).toBe(true);
    });
  });

  describe('Secure Filename Generation', () => {
    it('should generate secure filenames', () => {
      const filename1 = GCSUtils.generateSecureFilename('test.jpg');
      const filename2 = GCSUtils.generateSecureFilename('test.jpg');
      
      expect(filename1).not.toBe(filename2);
      expect(filename1).toMatch(/^\d+_[a-f0-9]{12}\.jpg$/);
    });

    it('should handle extensions correctly', () => {
      const filename = GCSUtils.generateSecureFilename(undefined, 'pdf');
      expect(filename).toMatch(/^\d+_[a-f0-9]{12}\.pdf$/);
    });

    it('should fallback to bin extension', () => {
      const filename = GCSUtils.generateSecureFilename();
      expect(filename).toMatch(/^\d+_[a-f0-9]{12}\.bin$/);
    });
  });
});

describe('Default Configurations', () => {
  it('should provide valid development configuration', () => {
    const devConfig = {
      projectId: 'test-project',
      bucketName: 'test-bucket',
      ...DEFAULT_CONFIGS.DEVELOPMENT,
    };

    const validation = GCSConfigValidator.validateConfig(devConfig);
    expect(validation.success).toBe(true);
  });

  it('should provide valid production configuration', () => {
    const prodConfig = {
      projectId: 'test-project',
      bucketName: 'test-bucket',
      ...DEFAULT_CONFIGS.PRODUCTION,
    };

    const validation = GCSConfigValidator.validateConfig(prodConfig);
    expect(validation.success).toBe(true);
  });

  it('should provide valid high-performance configuration', () => {
    const perfConfig = {
      projectId: 'test-project',
      bucketName: 'test-bucket',
      ...DEFAULT_CONFIGS.HIGH_PERFORMANCE,
    };

    const validation = GCSConfigValidator.validateConfig(perfConfig);
    expect(validation.success).toBe(true);
  });
});