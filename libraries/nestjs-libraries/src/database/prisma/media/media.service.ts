import { HttpException, Injectable } from '@nestjs/common';
import { MediaRepository } from '@gitroom/nestjs-libraries/database/prisma/media/media.repository';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { Organization } from '@prisma/client';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
import { VideoManager } from '@gitroom/nestjs-libraries/videos/video.manager';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
import { UploadFactory } from '@gitroom/nestjs-libraries/upload/upload.factory';
import {
  AuthorizationActions,
  Sections,
  SubscriptionException,
} from '@gitroom/backend/services/auth/permissions/permission.exception.class';

@Injectable()
export class MediaService {
  private storage = UploadFactory.createStorage();

  constructor(
    private _mediaRepository: MediaRepository,
    private _openAi: OpenaiService,
    private _subscriptionService: SubscriptionService,
    private _videoManager: VideoManager
  ) {}

  async deleteMedia(org: string, id: string) {
    return this._mediaRepository.deleteMedia(org, id);
  }

  getMediaById(id: string) {
    return this._mediaRepository.getMediaById(id);
  }

  async generateImage(
    prompt: string,
    org: Organization,
    generatePromptFirst?: boolean
  ) {
    return await this._subscriptionService.useCredit(
      org,
      'ai_images',
      async () => {
        if (generatePromptFirst) {
          prompt = await this._openAi.generatePromptForPicture(prompt);
          console.log('Prompt:', prompt);
        }
        return this._openAi.generateImage(prompt, !!generatePromptFirst);
      }
    );
  }

  saveFile(org: string, fileName: string, filePath: string) {
    return this._mediaRepository.saveFile(org, fileName, filePath);
  }

  async getMedia(org: string, page: number) {
    console.log(`🔍 MediaService.getMedia called for org: ${org}, page: ${page}`);
    const media = await this._mediaRepository.getMedia(org, page);
    console.log(`📊 Raw media from database:`, media?.results?.length || 0, 'items');
    
    // Convert GCS URLs to signed URLs for secure access  
    const mediaItems = media?.results || media;
    console.log(`🔍 Processing media items:`, typeof mediaItems, Array.isArray(mediaItems));
    
    if (mediaItems && Array.isArray(mediaItems)) {
      for (const item of mediaItems) {
        if (item.path && item.path.includes('storage.cloud.google.com')) {
          try {
            console.log(`🔐 Converting to signed URL: ${item.path}`);
            // Extract bucket and file path
            const urlParts = item.path.replace('https://storage.cloud.google.com/', '').split('/');
            const bucket = urlParts[0];
            const filePath = urlParts.slice(1).join('/');
            
            // Generate signed URL using our storage service
            const { Storage } = await import('@google-cloud/storage');
            const storage = new Storage({
              keyFilename: process.env.GCS_KEY_FILENAME,
              projectId: process.env.GCS_PROJECT_ID,
            });
            
            const file = storage.bucket(bucket).file(filePath);
            const [signedUrl] = await file.getSignedUrl({
              action: 'read',
              expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
              version: 'v4',
            });
            
            item.path = signedUrl;
            console.log(`✅ Generated signed URL for media: ${signedUrl.substring(0, 100)}...`);
          } catch (error) {
            console.error(`❌ Failed to generate signed URL for ${item.path}:`, (error as any)?.message);
          }
        }
      }
    }
    
    return media;
  }

  saveMediaInformation(org: string, data: SaveMediaInformationDto) {
    return this._mediaRepository.saveMediaInformation(org, data);
  }

  getVideoOptions() {
    return this._videoManager.getAllVideos();
  }

  async generateVideoAllowed(org: Organization, type: string) {
    const video = this._videoManager.getVideoByName(type);
    if (!video) {
      throw new Error(`Video type ${type} not found`);
    }

    if (!video.trial && org.isTrailing) {
      throw new HttpException('This video is not available in trial mode', 406);
    }

    return true;
  }

  async generateVideo(org: Organization, body: VideoDto) {
    const totalCredits = await this._subscriptionService.checkCredits(
      org,
      'ai_videos'
    );
    if (totalCredits.credits <= 0) {
      throw new SubscriptionException({
        action: AuthorizationActions.Create,
        section: Sections.VIDEOS_PER_MONTH,
      });
    }

    const video = this._videoManager.getVideoByName(body.type);
    if (!video) {
      throw new Error(`Video type ${body.type} not found`);
    }

    if (!video.trial && org.isTrailing) {
      throw new HttpException('This video is not available in trial mode', 406);
    }

    await video.instance.processAndValidate(body.customParams);

    return await this._subscriptionService.useCredit(
      org,
      'ai_videos',
      async () => {
        const loadedData = await video.instance.process(
          body.output,
          body.customParams
        );

        const file = await this.storage.uploadSimple(loadedData);
        return this.saveFile(org.id, file.split('/').pop(), file);
      }
    );
  }

  async videoFunction(identifier: string, functionName: string, body: any) {
    const video = this._videoManager.getVideoByName(identifier);
    if (!video) {
      throw new Error(`Video with identifier ${identifier} not found`);
    }

    // @ts-ignore
    const functionToCall = video.instance[functionName];
    if (typeof functionToCall !== 'function' || this._videoManager.checkAvailableVideoFunction(functionToCall)) {
      throw new HttpException(`Function ${functionName} not found on video instance`, 400);
    }

    return functionToCall(body);
  }
}
