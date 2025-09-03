import { Injectable, HttpException } from '@nestjs/common';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { UserStorageFactory } from '@gitroom/nestjs-libraries/upload/user-storage.factory';
import { IUploadProvider } from '@gitroom/nestjs-libraries/upload/upload.interface';

@Injectable()
export class UserMediaService extends MediaService {
  private userStorageInstances = new Map<string, IUploadProvider>();

  /**
   * 获取用户特定的存储实例
   */
  private getUserStorage(userId: string, userMediaStorage?: any): IUploadProvider {
    if (this.userStorageInstances.has(userId)) {
      return this.userStorageInstances.get(userId)!;
    }

    let storage: IUploadProvider;

    if (userMediaStorage) {
      // 使用用户的媒体存储配置
      storage = UserStorageFactory.createStorageFromConfig(userMediaStorage);
      console.log(`📦 Created storage from user config for ${userId}:`, userMediaStorage);
    } else {
      // 使用用户特定的环境变量
      storage = UserStorageFactory.createUserStorage(userId);
      console.log(`📦 Created storage from environment for ${userId}`);
    }

    this.userStorageInstances.set(userId, storage);
    return storage;
  }

  /**
   * 用户特定的文件上传
   */
  async uploadUserFile(
    userId: string,
    file: Express.Multer.File,
    userMediaStorage?: any
  ): Promise<string> {
    try {
      const storage = this.getUserStorage(userId, userMediaStorage);
      
      // 生成文件名
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop() || 'bin';
      const fileName = `${timestamp}-${Math.random().toString(36).substr(2, 8)}.${extension}`;
      
      console.log(`📤 Uploading file for user ${userId}: ${fileName}`);
      
      // 使用用户特定的存储上传文件
      const uploadResult = await storage.uploadSimple({
        buffer: file.buffer,
        originalname: fileName,
        mimetype: file.mimetype
      } as any);

      console.log(`✅ File uploaded successfully: ${uploadResult}`);
      return uploadResult;
      
    } catch (error) {
      console.error(`❌ Upload failed for user ${userId}:`, error);
      throw new HttpException(`File upload failed: ${error.message}`, 500);
    }
  }

  /**
   * 保存用户文件信息到数据库
   */
  async saveUserFile(
    organizationId: string,
    userId: string,
    fileName: string,
    filePath: string,
    userMediaStorage?: any
  ) {
    try {
      // 保存文件信息到数据库，包含存储路径信息
      const result = await this.saveFile(organizationId, fileName, filePath);
      
      // 如果有用户存储配置，可以保存额外的元数据
      if (userMediaStorage) {
        console.log(`💾 Saved file with storage path: ${userMediaStorage.bucket}/${userMediaStorage.path}/${fileName}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to save user file:`, error);
      throw error;
    }
  }

  /**
   * 获取用户的媒体文件列表
   */
  async getUserMedia(organizationId: string, page: number = 1) {
    try {
      // 使用原有的媒体获取逻辑
      const media = await this.getMedia(organizationId, page);
      
      console.log(`📋 Retrieved ${media.results?.length || 0} media files for organization ${organizationId}`);
      return media;
    } catch (error) {
      console.error(`❌ Failed to get user media:`, error);
      throw error;
    }
  }

  /**
   * 清理用户存储实例缓存
   */
  clearUserStorageCache(userId: string) {
    this.userStorageInstances.delete(userId);
    console.log(`🗑️  Cleared storage cache for user ${userId}`);
  }

  /**
   * 获取用户存储状态
   */
  getUserStorageInfo(userId: string) {
    const hasCache = this.userStorageInstances.has(userId);
    const keyFile = process.env[`GCS_KEY_FILE_${userId}`];
    const bucket = process.env[`GCS_BUCKET_${userId}`];
    const path = process.env[`GCS_PATH_${userId}`];
    
    return {
      userId,
      hasStorageCache: hasCache,
      configuration: {
        keyFile: keyFile ? '✅ Configured' : '❌ Missing',
        bucket: bucket || 'Not configured',
        path: path || 'Not configured'
      }
    };
  }
}