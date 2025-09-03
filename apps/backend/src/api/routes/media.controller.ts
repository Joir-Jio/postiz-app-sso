import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Headers,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { GetUserFromRequest } from '@gitroom/nestjs-libraries/user/user.from.request';
import { Organization } from '@prisma/client';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import handleR2Upload from '@gitroom/nestjs-libraries/upload/r2.uploader';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileValidationPipe } from '@gitroom/nestjs-libraries/upload/custom.upload.validation';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { UploadFactory } from '@gitroom/nestjs-libraries/upload/upload.factory';
import { UserStorageFactory } from '@gitroom/nestjs-libraries/upload/user-storage.factory';
import { GcsMediaScannerService } from '../../services/media/gcs-media-scanner.service';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
import { VideoFunctionDto } from '@gitroom/nestjs-libraries/dtos/videos/video.function.dto';

// SSO Media Services - Temporarily disabled
// import { ExternalMediaService } from '../../services/media/external-media.service';
// import { MediaReferenceService } from '../../services/media/media-reference.service';
// import { MediaProxyService } from '../../services/media/media-proxy.service';
// import { MediaSyncService } from '../../services/media/media-sync.service';

// SSO DTOs - Temporarily disabled
// import {
//   MediaUploadRequestDto,
//   MediaUploadResponseDto,
//   MediaAccessRequestDto,
//   MediaAccessResponseDto,
//   MediaSharingRequestDto,
//   MediaSharingResponseDto,
//   MediaDeletionRequestDto,
//   MediaDeletionResponseDto,
//   MediaProcessingStatusDto,
//   MediaProcessingStatusResponseDto,
// } from '@gitroom/nestjs-libraries/dtos/sso/sso-media.dto';

// SSO Types - Temporarily disabled
// import { SaasProduct, ProductUser } from '@gitroom/nestjs-libraries/types/sso/core.types';

@ApiTags('Media')
@Controller('/media')
export class MediaController {
  private storage = UploadFactory.createStorage();
  constructor(
    private _mediaService: MediaService,
    private _subscriptionService: SubscriptionService,
    private _gcsScanner: GcsMediaScannerService,
    // SSO services temporarily disabled
    // private readonly externalMediaService: ExternalMediaService,
    // private readonly mediaReferenceService: MediaReferenceService,
    // private readonly mediaProxyService: MediaProxyService,
    // private readonly mediaSyncService: MediaSyncService
  ) {}

  /**
   * 获取用户特定的存储实例
   */
  private getUserStorage(user: any) {
    if (user && user.mediaStorage) {
      console.log(`📦 Using user-specific storage for ${user.id}:`, user.mediaStorage);
      return UserStorageFactory.createStorageFromConfig(user.mediaStorage);
    }
    
    if (user && user.id) {
      console.log(`📦 Using user-specific storage for ${user.id} from environment variables`);
      return UserStorageFactory.createUserStorage(user.id);
    }
    
    console.log('📦 Using default storage');
    return this.storage;
  }

  @Delete('/:id')
  deleteMedia(@GetOrgFromRequest() org: Organization, @Param('id') id: string) {
    return this._mediaService.deleteMedia(org.id, id);
  }

  @Post('/generate-video')
  async generateVideo(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any,
    @Body() body: VideoDto
  ) {
    console.log('📹 Generating video for user:', user?.id);
    
    // 如果用户有特定的存储配置，我们需要处理这个
    // 目前暂时使用原有的服务，但加上日志
    const result = await this._mediaService.generateVideo(org, body);
    
    if (user?.mediaStorage) {
      console.log(`📦 Video should be saved to user storage: ${user.mediaStorage.bucket}/${user.mediaStorage.path}`);
    }
    
    return result;
  }

  @Post('/generate-image')
  async generateImage(
    @GetOrgFromRequest() org: Organization,
    @Req() req: Request,
    @Body('prompt') prompt: string,
    isPicturePrompt = false
  ) {
    const total = await this._subscriptionService.checkCredits(org);
    if (process.env.STRIPE_PUBLISHABLE_KEY && total.credits <= 0) {
      return false;
    }

    return {
      output:
        (isPicturePrompt ? '' : 'data:image/png;base64,') +
        (await this._mediaService.generateImage(prompt, org, isPicturePrompt)),
    };
  }

  @Post('/generate-image-with-prompt')
  async generateImageFromText(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any,
    @Req() req: Request,
    @Body('prompt') prompt: string
  ) {
    const image = await this.generateImage(org, req, prompt, true);
    if (!image) {
      return false;
    }

    const userStorage = this.getUserStorage(user);
    const file = await userStorage.uploadSimple(image.output);

    console.log(`✅ Generated image saved to user-specific storage: ${file}`);

    return this._mediaService.saveFile(org.id, file.split('/').pop(), file);
  }

  @Post('/upload-server')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new CustomFileValidationPipe())
  async uploadServer(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userStorage = this.getUserStorage(user);
    const uploadedFile = await userStorage.uploadFile(file);
    
    console.log(`✅ File uploaded to user-specific storage: ${uploadedFile.path}`);
    
    return this._mediaService.saveFile(
      org.id,
      uploadedFile.originalname,
      uploadedFile.path
    );
  }

  @Post('/save-media')
  async saveMedia(
    @GetOrgFromRequest() org: Organization,
    @Req() req: Request,
    @Body('name') name: string
  ) {
    if (!name) {
      return false;
    }
    return this._mediaService.saveFile(
      org.id,
      name,
      process.env.CLOUDFLARE_BUCKET_URL + '/' + name
    );
  }

  @Post('/information')
  saveMediaInformation(
    @GetOrgFromRequest() org: Organization,
    @Body() body: SaveMediaInformationDto
  ) {
    return this._mediaService.saveMediaInformation(org.id, body);
  }

  @Post('/upload-simple')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSimple(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any,
    @UploadedFile('file') file: Express.Multer.File,
    @Body('preventSave') preventSave: string = 'false'
  ) {
    const userStorage = this.getUserStorage(user);
    const getFile = await userStorage.uploadFile(file);

    console.log(`✅ Simple upload to user-specific storage: ${getFile.path}`);

    if (preventSave === 'true') {
      const { path } = getFile;
      return { path };
    }

    return this._mediaService.saveFile(
      org.id,
      getFile.originalname,
      getFile.path
    );
  }

  @Post('/:endpoint')
  async uploadFile(
    @GetOrgFromRequest() org: Organization,
    @Req() req: Request,
    @Res() res: Response,
    @Param('endpoint') endpoint: string
  ) {
    const upload = await handleR2Upload(endpoint, req, res);
    if (endpoint !== 'complete-multipart-upload') {
      return upload;
    }

    // @ts-ignore
    const name = upload.Location.split('/').pop();

    const saveFile = await this._mediaService.saveFile(
      org.id,
      name,
      // @ts-ignore
      upload.Location
    );

    res.status(200).json({ ...upload, saved: saveFile });
  }

  @Get('/')
  async getMedia(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any,
    @Query('page') page: number
  ) {
    console.log(`📋 Getting media for organization: ${org.id}, user: ${user?.id}`);
    
    // 如果用户有特定的存储配置，先同步GCS文件
    if (user?.mediaStorage) {
      console.log(`📦 User has specific storage config: ${user.mediaStorage.bucket}/${user.mediaStorage.path}`);
      
      try {
        console.log(`🔄 Triggering GCS media sync for user storage...`);
        const syncResult = await this._gcsScanner.quickSyncForSsoUser(org.id, user);
        console.log(`✅ GCS sync complete: found ${syncResult.found}, new ${syncResult.new}, errors ${syncResult.errors}`);
      } catch (error) {
        console.error(`❌ GCS sync failed:`, error);
        // 继续执行，即使同步失败也要返回现有数据
      }
    }
    
    const media = await this._mediaService.getMedia(org.id, page);
    console.log(`📋 Found ${media?.results?.length || 0} media items`);
    
    return media;
  }

  @Get('/cache/status')
  @ApiOperation({
    summary: 'Get GCS scan cache status',
    description: 'Check GCS media scanner cache statistics'
  })
  async getCacheStatus(@GetOrgFromRequest() org: Organization) {
    return this._gcsScanner.getStatus();
  }

  @Post('/cache/refresh')
  @ApiOperation({
    summary: 'Refresh GCS scan cache',
    description: 'Force refresh GCS media scan cache for current user'
  })
  async refreshCache(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any
  ) {
    if (!user?.mediaStorage) {
      throw new HttpException('User has no specific storage configuration', 400);
    }

    const result = await this._gcsScanner.refreshCache(org.id, user.mediaStorage);
    
    return {
      message: 'Cache refreshed successfully',
      result,
      timestamp: new Date().toISOString()
    };
  }

  @Get('/video-options')
  getVideos() {
    return this._mediaService.getVideoOptions();
  }

  @Get('/test-gcs-scan')
  async testGcsScan(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: any
  ) {
    console.log(`🧪 Test GCS scan endpoint called`);
    console.log(`   Organization: ${org.id}`);
    console.log(`   User: ${JSON.stringify(user, null, 2)}`);
    
    if (!user?.mediaStorage) {
      return {
        success: false,
        message: 'No media storage configuration found for user',
        user: user ? { id: user.id, email: user.email } : null
      };
    }

    try {
      const syncResult = await this._gcsScanner.quickSyncForSsoUser(org.id, user);
      return {
        success: true,
        message: 'GCS scan completed successfully',
        result: syncResult,
        userStorage: user.mediaStorage
      };
    } catch (error) {
      console.error(`❌ GCS scan test failed:`, error);
      return {
        success: false,
        message: 'GCS scan failed',
        error: error.message,
        userStorage: user.mediaStorage
      };
    }
  }

  @Post('/video/function')
  videoFunction(
    @Body() body: VideoFunctionDto
  ) {
    return this._mediaService.videoFunction(body.identifier, body.functionName, body.params);
  }

  @Get('/generate-video/:type/allowed')
  generateVideoAllowed(
    @GetOrgFromRequest() org: Organization,
    @Param('type') type: string
  ) {
    return this._mediaService.generateVideoAllowed(org, type);
  }

  // ===============================
  // External Media Endpoints (SSO) - TEMPORARILY DISABLED
  // ===============================

  /* Disabled due to SSO dependencies
  @Post('/reference')
  @ApiOperation({
    summary: 'Reference external GCS file without re-uploading',
    description: 'Creates a media reference to an external file in GCS for SSO integration'
  })
  @ApiResponse({ status: 201, description: 'Media reference created successfully' })
  @ApiBearerAuth('ProductToken')
  async referenceExternalFile(
    @GetOrgFromRequest() org: Organization,
    @Body() request: MediaUploadRequestDto,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string
  ) {
    if (!productKey || !externalUserId) {
      throw new HttpException('Product key and external user ID required', 400);
    }

    // This would typically be handled by SSO middleware that validates and injects ProductUser
    // For now, we'll create a simplified implementation
    const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
    const product = await this.getProductByKey(productKey);

    const mediaReference = await this.mediaReferenceService.createMediaReference({
      productUser,
      product,
      externalMediaId: request.externalMediaId,
      gcsPath: request.gcsPath,
      metadata: request.metadata,
      processingOptions: request.processingOptions,
    });

    return {
      success: true,
      mediaId: mediaReference.id,
      localPath: (mediaReference.metadata as any)?.localPath,
      proxyUrl: `/api/media/proxy/${mediaReference.id}`,
      thumbnailUrl: mediaReference.thumbnailPath ? `/api/media/thumbnail/${mediaReference.id}` : undefined,
    };
  }

  @Post('/access')
  @ApiOperation({
    summary: 'Request access to external media files',
    description: 'Generate secure access tokens and URLs for external media files'
  })
  @ApiResponse({ status: 200, type: MediaAccessResponseDto })
  @ApiBearerAuth('ProductToken')
  async requestMediaAccess(
    @GetOrgFromRequest() org: Organization,
    @Body() request: MediaAccessRequestDto,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string
  ): Promise<MediaAccessResponseDto> {
    if (!productKey || !externalUserId) {
      throw new HttpException('Product key and external user ID required', 400);
    }

    const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
    const product = await this.getProductByKey(productKey);

    return this.mediaReferenceService.handleMediaAccessRequest(request, productUser, product);
  }

  @Get('/proxy/:mediaReferenceId')
  @ApiOperation({
    summary: 'Proxy access to external media file',
    description: 'Securely stream external media file content with access validation'
  })
  @ApiParam({ name: 'mediaReferenceId', description: 'Media reference ID' })
  @ApiQuery({ name: 'token', description: 'Access token', required: false })
  async proxyMediaFile(
    @Param('mediaReferenceId') mediaReferenceId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query('range') range?: string,
    @Query('download') download?: string
  ) {
    const options = {
      range,
      downloadName: download || undefined,
      inline: !download,
    };

    return this.mediaProxyService.streamMediaFile(mediaReferenceId, req, res, options);
  }

  @Get('/thumbnail/:mediaReferenceId')
  @ApiOperation({
    summary: 'Get thumbnail for media file',
    description: 'Retrieve thumbnail image for external media file'
  })
  @ApiParam({ name: 'mediaReferenceId', description: 'Media reference ID' })
  @ApiQuery({ name: 'token', description: 'Access token', required: false })
  @ApiQuery({ name: 'width', description: 'Thumbnail width', required: false })
  @ApiQuery({ name: 'height', description: 'Thumbnail height', required: false })
  async getMediaThumbnail(
    @Param('mediaReferenceId') mediaReferenceId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query('width') width?: string,
    @Query('height') height?: string
  ) {
    const size = {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
    };

    return this.mediaProxyService.getThumbnail(mediaReferenceId, req, res, size);
  }

  @Get('/download/:mediaReferenceId')
  @ApiOperation({
    summary: 'Download media file',
    description: 'Download external media file with token validation'
  })
  @ApiParam({ name: 'mediaReferenceId', description: 'Media reference ID' })
  @ApiQuery({ name: 'token', description: 'Download token', required: true })
  async downloadMediaFile(
    @Param('mediaReferenceId') mediaReferenceId: string,
    @Query('token') token: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    if (!token) {
      throw new HttpException('Download token required', 400);
    }

    return this.mediaProxyService.downloadFile(mediaReferenceId, token, req, res);
  }

  @Post('/generate-download-link/:mediaReferenceId')
  @ApiOperation({
    summary: 'Generate secure download link',
    description: 'Create a time-limited download link for external media file'
  })
  @ApiParam({ name: 'mediaReferenceId', description: 'Media reference ID' })
  @ApiBearerAuth('ProductToken')
  async generateDownloadLink(
    @GetOrgFromRequest() org: Organization,
    @Param('mediaReferenceId') mediaReferenceId: string,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string,
    @Query('expires') expiryHours?: string,
    @Query('filename') downloadName?: string
  ) {
    if (!productKey || !externalUserId) {
      throw new HttpException('Product key and external user ID required', 400);
    }

    const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
    const expires = expiryHours ? parseInt(expiryHours) : 1;

    return this.mediaProxyService.generateDownloadLink(
      mediaReferenceId,
      productUser,
      expires,
      downloadName
    );
  }

  @Get('/external')
  @ApiOperation({
    summary: 'List external media references',
    description: 'Get paginated list of external media references for current user'
  })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false })
  @ApiBearerAuth('ProductToken')
  async listExternalMedia(
    @GetOrgFromRequest() org: Organization,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    if (!productKey || !externalUserId) {
      throw new HttpException('Product key and external user ID required', 400);
    }

    const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
    const product = await this.getProductByKey(productKey);
    const pageNum = page ? parseInt(page) : 1;
    const pageLimit = limit ? parseInt(limit) : 28;

    const result = await this.mediaReferenceService.getMediaReferencesWithAccess(
      productUser,
      product,
      pageNum,
      pageLimit
    );

    return {
      success: true,
      page: pageNum,
      limit: pageLimit,
      total: result.total,
      pages: result.pages,
      media: result.references,
    };
  }

  @Delete('/external/:mediaReferenceId')
  @ApiOperation({
    summary: 'Delete external media reference',
    description: 'Remove external media reference and optionally delete from GCS'
  })
  @ApiParam({ name: 'mediaReferenceId', description: 'Media reference ID' })
  @ApiQuery({ name: 'permanent', description: 'Permanently delete from GCS', required: false })
  @ApiBearerAuth('ProductToken')
  async deleteExternalMedia(
    @GetOrgFromRequest() org: Organization,
    @Param('mediaReferenceId') mediaReferenceId: string,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string,
    @Query('permanent') permanent?: string
  ) {
    if (!productKey || !externalUserId) {
      throw new HttpException('Product key and external user ID required', 400);
    }

    const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
    const permanentDelete = permanent === 'true';

    const success = await this.mediaReferenceService.deleteMediaReference(
      mediaReferenceId,
      productUser,
      permanentDelete
    );

    return {
      success,
      deleted: success,
      permanent: permanentDelete,
    };
  }

  @Post('/external/share')
  @ApiOperation({
    summary: 'Share external media between products',
    description: 'Create secure sharing link for external media files'
  })
  @ApiResponse({ status: 200, type: MediaSharingResponseDto })
  @ApiBearerAuth('ProductToken')
  async shareExternalMedia(
    @GetOrgFromRequest() org: Organization,
    @Body() request: MediaSharingRequestDto,
    @Headers('x-product-key') productKey?: string,
    @Headers('x-external-user-id') externalUserId?: string
  ): Promise<MediaSharingResponseDto> {
    // This would be implemented for inter-product media sharing
    // For now, return a placeholder response
    throw new HttpException('Media sharing not yet implemented', 501);
  }

  @Get('/sync/status')
  @ApiOperation({
    summary: 'Get media sync status',
    description: 'Check status of media synchronization services'
  })
  async getSyncStatus() {
    const stats = this.mediaSyncService.getSyncStats();
    const proxyStats = this.mediaProxyService.getServiceStats();
    
    return {
      sync: stats,
      proxy: proxyStats,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('/sync/force/:productKey')
  @ApiOperation({
    summary: 'Force sync for product',
    description: 'Manually trigger synchronization for a specific product'
  })
  @ApiParam({ name: 'productKey', description: 'Product key to sync' })
  async forceSyncProduct(@Param('productKey') productKey: string) {
    const result = await this.mediaSyncService.forceSyncProduct(productKey);
    
    return {
      success: true,
      productKey,
      result,
    };
  }

  @Get('/inconsistent')
  @ApiOperation({
    summary: 'Find inconsistent media',
    description: 'List media references that need attention'
  })
  @ApiQuery({ name: 'productKey', description: 'Filter by product key', required: false })
  @ApiQuery({ name: 'limit', description: 'Maximum items to return', required: false })
  async getInconsistentMedia(
    @Query('productKey') productKey?: string,
    @Query('limit') limit?: string
  ) {
    const productKeys = productKey ? [productKey] : undefined;
    const maxLimit = limit ? parseInt(limit) : 100;

    const inconsistentMedia = await this.mediaSyncService.findInconsistentMedia(
      productKeys,
      maxLimit
    );

    return {
      success: true,
      count: inconsistentMedia.length,
      inconsistentMedia,
    };
  }

  */

  // ===============================
  // Helper Methods - TEMPORARILY DISABLED
  // ===============================

  /* Disabled SSO helper methods
  private async getProductUserContext(
    organizationId: string,
    productKey: string,
    externalUserId: string
  ): Promise<ProductUser> {
    // This is a simplified implementation
    // In production, this would use proper repository services
    // and be handled by SSO middleware
    
    // For now, create a mock ProductUser
    // This should be replaced with actual database queries
    return {
      id: `pu_${organizationId}_${productKey}_${externalUserId}`,
      productId: `prod_${productKey}`,
      userId: `user_${externalUserId}`,
      organizationId,
      externalUserId,
      externalUserEmail: `${externalUserId}@example.com`,
      externalUserName: `User ${externalUserId}`,
      externalUserMetadata: {},
      ssoSessionId: null,
      lastSsoLogin: null,
      ssoTokenHash: null,
      preferences: {},
      permissions: { 'media:read': true, 'media:write': true, 'media:delete': true },
      isActive: true,
      dataAccessLevel: 'full' as any,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      loginCount: 0,
      failedLoginAttempts: 0,
      knownDevices: [],
    };
  }

  private async getProductByKey(productKey: string): Promise<SaasProduct> {
    // This is a simplified implementation
    // In production, this would use proper repository services
    
    // For now, create a mock SaasProduct
    // This should be replaced with actual database queries
    return {
      id: `prod_${productKey}`,
      productKey,
      productName: `Product ${productKey}`,
      productDescription: `Description for ${productKey}`,
      baseUrl: `https://${productKey}.example.com`,
      // apiKeyHash: null, // Removed field that doesn't exist in SaasProduct type
      webhookSecret: null,
      ssoEnabled: true,
      ssoRedirectUrl: `https://${productKey}.example.com/sso/callback`,
      allowedDomains: [],
      gcsBucketName: `${productKey}-bucket`,
      gcsBasePath: productKey,
      gcsCredentialsJson: null,
      settings: {},
      metadata: {},
      autoCreateUsers: true,
      allowMediaUpload: true,
      dataIsolationEnabled: true,
      status: 'active' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    };
  }
  */
}
