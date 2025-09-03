# 用户媒体存储集成指南

## 概述
在SSO登录时，需要为每个用户配置专属的媒体存储路径，确保用户的视频、图片等媒体文件存储在正确的位置。

## 存储配置参数

### 在SSO Token中添加存储信息

```javascript
function generateSsoToken(user) {
  const payload = {
    // 基础用户信息
    userId: user.id,
    email: user.email,
    name: user.name,
    
    // 媒体存储配置
    mediaStorage: {
      provider: 'gcs', // 或 'aws', 'local', 'cloudflare'
      bucket: user.storageBucket || 'hyperhusk01-result-bucket',
      path: user.storagePath || `${user.id}`, // 用户专属路径
      region: user.storageRegion || 'us-central1',
      
      // 访问凭据 (可选，建议通过环境变量配置)
      credentials: {
        keyFile: user.storageKeyFile, // GCS服务账号密钥文件路径
        // 或者
        accessKeyId: user.awsAccessKey,     // AWS访问密钥
        secretAccessKey: user.awsSecretKey  // AWS秘密密钥
      }
    },
    
    // 其他配置...
    productKey: 'your-product',
    iss: 'your-product',
    aud: 'postiz',
    exp: Math.floor(Date.now() / 1000) + (60 * 15),
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, SSO_SECRET);
}
```

## 用户存储配置示例

### 示例数据结构
```javascript
const USERS_WITH_STORAGE = [
  {
    id: '62152016094',
    email: 'user1@example.com',
    name: 'User 1',
    // 存储配置
    storageBucket: 'hyperhusk01-result-bucket',
    storagePath: '62152016094',           // 用户专属目录
    storageProvider: 'gcs',
    storageKeyFile: '/path/to/user1-gcs-key.json'
  },
  {
    id: 'K7mN9pQx2R',
    email: 'user2@example.com', 
    name: 'User 2',
    // 存储配置
    storageBucket: 'hyperhusk01-result-bucket',
    storagePath: 'K7mN9pQx2R-DEV/2',     // 用户专属目录
    storageProvider: 'gcs',
    storageKeyFile: '/path/to/user2-gcs-key.json'
  }
];
```

### 生成带存储配置的SSO Token
```javascript
app.post('/api/sso/generate-login-url', (req, res) => {
  try {
    const { userId } = req.body;
    const user = findUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 生成包含存储配置的 SSO token
    const ssoToken = jwt.sign({
      // 用户信息
      userId: user.id,
      email: user.email,
      name: user.name,
      
      // 媒体存储配置
      mediaStorage: {
        provider: user.storageProvider || 'gcs',
        bucket: user.storageBucket || 'hyperhusk01-result-bucket',
        path: user.storagePath || user.id,
        region: user.storageRegion || 'us-central1',
        
        // 存储配置
        config: {
          // GCS配置
          keyFile: user.storageKeyFile,
          projectId: user.gcsProjectId || 'default-project',
          
          // 或AWS配置
          accessKeyId: user.awsAccessKey,
          secretAccessKey: user.awsSecretKey,
          region: user.awsRegion
        }
      },
      
      // 权限配置
      permissions: {
        canUploadMedia: true,
        canDeleteMedia: user.role === 'admin',
        maxFileSize: user.maxFileSize || '100MB',
        allowedTypes: ['image/*', 'video/*', 'audio/*']
      },
      
      // JWT标准字段
      iss: 'your-product',
      aud: 'postiz',
      exp: Math.floor(Date.now() / 1000) + (60 * 15),
      iat: Math.floor(Date.now() / 1000)
    }, SSO_SECRET);

    // 构建登录URL
    const postizUrl = new URL('/seamless-login', 'http://localhost:4200');
    postizUrl.searchParams.set('token', ssoToken);

    res.json({
      success: true,
      loginUrl: postizUrl.toString(),
      userStoragePath: \`\${user.storageBucket}/\${user.storagePath}\`
    });

  } catch (error) {
    console.error('SSO login error:', error);
    res.status(500).json({ error: 'SSO login failed' });
  }
});
```

## Postiz端处理存储配置

### 修改SSO登录控制器
```typescript
// apps/backend/src/api/routes/sso-login.controller.ts

interface SsoTokenLoginDto {
  token: string;
  productKey?: string;
  redirectUrl?: string;
}

interface MediaStorageConfig {
  provider: 'gcs' | 'aws' | 'local' | 'cloudflare';
  bucket: string;
  path: string;
  region?: string;
  config?: {
    keyFile?: string;
    projectId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
}

@Controller('sso')
export class SsoLoginController {
  
  @Post('token-login')
  async tokenLogin(@Body() loginData: SsoTokenLoginDto): Promise<SsoLoginResponse> {
    try {
      // 解析JWT token
      const decoded = jwt.verify(loginData.token, SSO_SECRET) as any;
      
      // 提取用户信息
      const user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      };
      
      // 提取存储配置
      const mediaStorage: MediaStorageConfig = decoded.mediaStorage;
      
      // 为用户设置存储配置
      await this.configureUserStorage(user.id, mediaStorage);
      
      // 生成访问令牌
      const accessToken = AuthChecker.signJWT({
        ...user,
        mediaStoragePath: \`\${mediaStorage.bucket}/\${mediaStorage.path}\`
      });

      return {
        success: true,
        accessToken,
        user: {
          ...user,
          storagePath: \`\${mediaStorage.bucket}/\${mediaStorage.path}\`
        }
      };

    } catch (error) {
      console.error('SSO Token Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
  
  private async configureUserStorage(userId: string, storageConfig: MediaStorageConfig) {
    // 将存储配置保存到数据库或缓存中
    // 这样用户后续上传媒体时就会使用正确的存储路径
    
    const userStorageConfig = {
      userId,
      provider: storageConfig.provider,
      bucket: storageConfig.bucket,
      path: storageConfig.path,
      region: storageConfig.region,
      config: storageConfig.config
    };
    
    // 保存到数据库（伪代码）
    await this.userStorageService.saveConfig(userStorageConfig);
    
    // 或保存到Redis缓存
    await this.redis.set(\`user-storage:\${userId}\`, JSON.stringify(userStorageConfig));
  }
}
```

## 媒体上传服务集成

### 动态存储路径
```typescript
// 媒体上传服务示例
class MediaUploadService {
  
  async uploadFile(userId: string, file: Express.Multer.File) {
    // 获取用户的存储配置
    const storageConfig = await this.getUserStorageConfig(userId);
    
    // 构建文件路径
    const fileName = \`\${Date.now()}-\${file.originalname}\`;
    const filePath = \`\${storageConfig.path}/\${fileName}\`;
    
    let uploadResult;
    
    switch (storageConfig.provider) {
      case 'gcs':
        uploadResult = await this.uploadToGCS(
          file, 
          storageConfig.bucket, 
          filePath,
          storageConfig.config
        );
        break;
        
      case 'aws':
        uploadResult = await this.uploadToS3(
          file,
          storageConfig.bucket,
          filePath,
          storageConfig.config
        );
        break;
        
      default:
        throw new Error('Unsupported storage provider');
    }
    
    return {
      url: uploadResult.url,
      path: filePath,
      bucket: storageConfig.bucket,
      provider: storageConfig.provider
    };
  }
  
  private async getUserStorageConfig(userId: string) {
    // 从数据库或缓存获取用户存储配置
    const config = await this.redis.get(\`user-storage:\${userId}\`);
    return config ? JSON.parse(config) : this.getDefaultConfig();
  }
  
  private async uploadToGCS(file: any, bucket: string, path: string, config: any) {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage({
      keyFilename: config.keyFile,
      projectId: config.projectId
    });
    
    const bucketInstance = storage.bucket(bucket);
    const fileInstance = bucketInstance.file(path);
    
    await fileInstance.save(file.buffer);
    
    return {
      url: \`https://storage.googleapis.com/\${bucket}/\${path}\`
    };
  }
}
```

## 完整示例

### 更新外部应用示例
```javascript
const USERS_WITH_STORAGE = [
  {
    id: '62152016094',
    email: 'user1@example.com',
    name: 'User 1',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    // 存储配置
    storageBucket: 'hyperhusk01-result-bucket',
    storagePath: '62152016094',
    storageProvider: 'gcs',
    gcsProjectId: 'your-gcs-project',
    storageKeyFile: '/path/to/user1-service-account.json'
  },
  {
    id: 'K7mN9pQx2R',
    email: 'user2@example.com',
    name: 'User 2', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    // 存储配置
    storageBucket: 'hyperhusk01-result-bucket',
    storagePath: 'K7mN9pQx2R-DEV/2',
    storageProvider: 'gcs',
    gcsProjectId: 'your-gcs-project',
    storageKeyFile: '/path/to/user2-service-account.json'
  }
];

function generateSsoTokenWithStorage(user) {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    
    // 存储配置
    mediaStorage: {
      provider: user.storageProvider,
      bucket: user.storageBucket,
      path: user.storagePath,
      region: 'us-central1',
      config: {
        keyFile: user.storageKeyFile,
        projectId: user.gcsProjectId
      }
    },
    
    // 权限配置
    permissions: {
      canUploadMedia: true,
      canDeleteMedia: user.role === 'admin',
      maxFileSize: '100MB'
    },
    
    iss: 'your-product',
    aud: 'postiz', 
    exp: Math.floor(Date.now() / 1000) + (60 * 15),
    iat: Math.floor(Date.now() / 1000)
  }, SSO_SECRET);
}
```

## 安全注意事项

1. **凭据安全** - 不要在JWT中明文传输敏感凭据
2. **路径验证** - 验证用户只能访问自己的存储路径
3. **权限控制** - 根据用户角色设置不同的存储权限
4. **配置加密** - 敏感的存储配置应该加密存储

这样，每个用户登录时就会自动配置他们专属的存储路径了！需要我帮你实现具体的某个部分吗？