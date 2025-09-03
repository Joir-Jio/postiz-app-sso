import { Controller, Post, Body, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '@gitroom/backend/services/auth/auth.service';
import { AuthService as AuthChecker } from '@gitroom/helpers/auth/auth.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { Provider } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

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

interface SsoTokenPayload {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  organizationId?: string;
  role?: string;
  productKey?: string;
  mediaStorage?: MediaStorageConfig;
  permissions?: {
    canUploadMedia?: boolean;
    canDeleteMedia?: boolean;
    canShareMedia?: boolean;
    maxFileSize?: string;
    allowedTypes?: string[];
  };
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

interface SsoLoginResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  mediaStoragePath?: string;
  apiKey?: string;  // 加密的API密钥字段（与frontend /user/self 行为一致）
  error?: string;
}

@Controller('sso')
export class SsoLoginController {
  private readonly SSO_SECRET = process.env.SSO_SECRET || 'your-shared-sso-secret-key';
  
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationService
  ) {}

  private async configureUserStorage(userId: string, storageConfig: MediaStorageConfig): Promise<void> {
    try {
      if (storageConfig.provider === 'gcs' && storageConfig.config) {
        // Use shared GCS key file for all users with different paths
        const sharedKeyFile = path.join(process.cwd(), 'keys', 'shared-gcs-service-account.json');
        
        // Check if the shared key file exists
        if (fs.existsSync(sharedKeyFile)) {
          // Store user-specific configuration in environment variables
          process.env[`GCS_BUCKET_${userId}`] = storageConfig.bucket;
          process.env[`GCS_PATH_${userId}`] = storageConfig.path;
          process.env[`GCS_PROJECT_ID_${userId}`] = storageConfig.config.projectId;
          
          console.log(`✅ Configured GCS storage for user ${userId}:`, {
            bucket: storageConfig.bucket,
            path: storageConfig.path,
            projectId: storageConfig.config.projectId,
            sharedKeyFile: sharedKeyFile
          });
        } else {
          console.warn(`⚠️  Shared GCS key file not found: ${sharedKeyFile}`);
        }
      }
    } catch (error) {
      console.error('Error configuring user storage:', error);
    }
  }

  @Post('token-login')
  @HttpCode(HttpStatus.OK)
  async tokenLogin(@Body() loginData: SsoTokenLoginDto): Promise<SsoLoginResponse> {
    try {
      console.log('🎫 SSO Token Login attempt:', { token: loginData.token.substring(0, 20) + '...' });

      if (!loginData.token) {
        return {
          success: false,
          error: 'Token is required'
        };
      }

      // 解析JWT令牌
      let decoded: SsoTokenPayload;
      try {
        decoded = jwt.verify(loginData.token, this.SSO_SECRET) as SsoTokenPayload;
        console.log('✅ JWT token verified successfully');
      } catch (jwtError) {
        console.error('❌ JWT verification failed:', jwtError.message);
        return {
          success: false,
          error: 'Invalid or expired token'
        };
      }

      // 验证必需字段
      if (!decoded.userId || !decoded.email || !decoded.name) {
        return {
          success: false,
          error: 'Token missing required user information'
        };
      }

      // 验证token未过期
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return {
          success: false,
          error: 'Token has expired'
        };
      }

      // 查找或创建数据库用户 - 搜索所有provider类型的用户
      let dbUser;
      try {
        // 直接使用Prisma查找任何provider的用户
        const users = await this.usersService['_usersRepository']['_user'].model.user.findMany({
          where: { email: decoded.email },
          include: {
            picture: true
          }
        });
        
        dbUser = users.length > 0 ? users[0] : null;
        if (dbUser) {
          console.log(`✅ Found existing user with DB ID: ${dbUser.id}, provider: ${dbUser.providerName}`);
        } else {
          console.log(`🔍 No existing user found for email: ${decoded.email}`);
        }
      } catch (error) {
        console.error('❌ Error searching for user:', error.message);
        dbUser = null;
      }

      if (!dbUser) {
        // SSO用户不存在，尝试创建新用户和组织
        console.log(`🆕 Creating new SSO user: ${decoded.email}`);
        try {
          const createUserDto = new CreateOrgUserDto();
          createUserDto.email = decoded.email;
          createUserDto.password = '';
          createUserDto.company = decoded.name || decoded.email.split('@')[0];
          createUserDto.provider = Provider.GENERIC;  // SSO用户使用GENERIC provider
          createUserDto.providerToken = '';  // SSO不需要providerToken
          
          const orgData = await this.organizationService.createOrgAndUser(
            createUserDto,
            '127.0.0.1',  // IP placeholder
            'SSO-Client'  // User agent placeholder
          );
          dbUser = orgData.users[0].user;
          console.log(`✅ Created SSO user with DB ID: ${dbUser.id}`);
        } catch (createError) {
          // 如果创建失败（比如用户已存在），尝试重新查找用户
          console.log(`⚠️  User creation failed, trying to find existing user: ${createError.message}`);
          try {
            dbUser = await this.usersService.getUserByEmail(decoded.email);
            if (dbUser) {
              console.log(`✅ Found existing SSO user with DB ID: ${dbUser.id}`);
            } else {
              // 如果还是找不到用户，尝试用不同的provider创建
              console.log(`🔄 Trying to create user with different provider...`);
              const altCreateUserDto = new CreateOrgUserDto();
              altCreateUserDto.email = decoded.email;
              altCreateUserDto.password = '';
              altCreateUserDto.company = decoded.name || decoded.email.split('@')[0];
              altCreateUserDto.provider = Provider.GOOGLE;  // 尝试不同的provider
              altCreateUserDto.providerToken = 'sso-token';
              
              const altOrgData = await this.organizationService.createOrgAndUser(
                altCreateUserDto,
                '127.0.0.1',
                'SSO-Client'
              );
              dbUser = altOrgData.users[0].user;
              console.log(`✅ Created SSO user with alternative provider, DB ID: ${dbUser.id}`);
            }
          } catch (findError) {
            console.error(`❌ Failed to find user after creation failure: ${findError.message}`);
            console.error(`❌ Original creation error: ${createError.message}`);
            // 作为最后手段，返回成功但使用临时用户数据
            console.log(`🆘 Using fallback user creation approach...`);
            return {
              success: false,
              error: 'User creation and lookup failed - please try with a different email or contact support'
            };
          }
        }
      }

      // 最终检查：确保我们有有效的用户对象
      if (!dbUser || !dbUser.id) {
        console.error('❌ No valid user found after all attempts');
        return {
          success: false,
          error: 'User creation or lookup failed'
        };
      }

      // 获取用户的组织信息，包括API密钥
      let userOrg;
      let apiKey = '';
      try {
        const orgData = await this.organizationService.getOrgsByUserId(dbUser.id);
        if (orgData && orgData.length > 0) {
          userOrg = orgData[0];
          // 返回原始加密的API密钥，与frontend /user/self 行为一致
          if (userOrg.apiKey) {
            apiKey = userOrg.apiKey; // 不解密，直接返回加密值
          }
          console.log(`✅ Retrieved encrypted API key for user ${dbUser.id}: ${apiKey.substring(0, 20)}...`);
        }
      } catch (error) {
        console.warn('⚠️ Failed to get user organization/API key:', error.message);
      }

      // 构建用户对象，使用数据库ID并包含必需的认证字段
      const user = {
        id: dbUser.id,  // 使用数据库ID，不是SSO ID
        email: dbUser.email,
        name: decoded.name || dbUser.name,
        avatar: decoded.avatar,
        organizationId: userOrg?.id || decoded.organizationId,
        role: decoded.role || 'user',
        activated: true,  // SSO用户默认激活
        isSuperAdmin: false,  // 安全起见，SSO用户默认不是超级管理员
        provider: dbUser.provider || 'GENERIC',  // 包含认证提供者信息
        providerName: dbUser.providerName || 'SSO',  // 包含认证提供者名称
        apiKey: apiKey  // 添加API密钥到响应中
      };

      // 处理媒体存储配置
      let mediaStoragePath = '';
      if (decoded.mediaStorage) {
        await this.configureUserStorage(decoded.userId, decoded.mediaStorage);
        mediaStoragePath = `${decoded.mediaStorage.bucket}/${decoded.mediaStorage.path}`;
        
        // 将媒体存储配置添加到用户对象中
        (user as any).mediaStorage = {
          provider: decoded.mediaStorage.provider,
          bucket: decoded.mediaStorage.bucket,
          path: decoded.mediaStorage.path,
          fullPath: mediaStoragePath
        };

        console.log('📦 Media storage configured:', mediaStoragePath);
      }

      // 生成访问令牌
      const jwtToken = AuthChecker.signJWT({
        ...user,
        mediaStoragePath,
        permissions: decoded.permissions
      });

      console.log(`🚀 SSO login successful for user: ${user.name} (${user.email})`);

      return {
        success: true,
        accessToken: jwtToken,
        user,
        mediaStoragePath,
        apiKey: apiKey  // 提供加密的API密钥（frontend将用于Public API调用）
      };

    } catch (error) {
      console.error('❌ SSO Token Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() data: { token: string }): Promise<{ valid: boolean; user?: any; mediaStorage?: any; error?: string }> {
    try {
      if (!data.token) {
        return { valid: false, error: 'Token is required' };
      }

      // 解析并验证JWT令牌
      let decoded: SsoTokenPayload;
      try {
        decoded = jwt.verify(data.token, this.SSO_SECRET) as SsoTokenPayload;
      } catch (jwtError) {
        return { valid: false, error: 'Invalid or expired token' };
      }

      // 验证必需字段
      if (!decoded.userId || !decoded.email || !decoded.name) {
        return { valid: false, error: 'Token missing required user information' };
      }

      // 验证token未过期
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token has expired' };
      }

      const user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.avatar,
        organizationId: decoded.organizationId,
        role: decoded.role || 'user'
      };

      const response: any = {
        valid: true,
        user
      };

      // 包含媒体存储配置
      if (decoded.mediaStorage) {
        response.mediaStorage = {
          provider: decoded.mediaStorage.provider,
          bucket: decoded.mediaStorage.bucket,
          path: decoded.mediaStorage.path,
          fullPath: `${decoded.mediaStorage.bucket}/${decoded.mediaStorage.path}`
        };
      }

      return response;

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { valid: false, error: 'Token validation failed' };
    }
  }
}