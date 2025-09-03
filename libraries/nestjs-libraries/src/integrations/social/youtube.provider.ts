import {
  AnalyticsData,
  AuthTokenDetails,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import axios from 'axios';
import { YoutubeSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/youtube.settings.dto';
import {
  BadBody,
  SocialAbstract,
} from '@gitroom/nestjs-libraries/integrations/social.abstract';
import * as process from 'node:process';
import dayjs from 'dayjs';
import { GaxiosResponse } from 'gaxios/build/src/common';
import Schema$Video = youtube_v3.Schema$Video;

const clientAndYoutube = () => {
  const client = new google.auth.OAuth2({
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
  });

  const youtube = (newClient: OAuth2Client) =>
    google.youtube({
      version: 'v3',
      auth: newClient,
    });

  const youtubeAnalytics = (newClient: OAuth2Client) =>
    google.youtubeAnalytics({
      version: 'v2',
      auth: newClient,
    });

  const oauth2 = (newClient: OAuth2Client) =>
    google.oauth2({
      version: 'v2',
      auth: newClient,
    });

  return { client, youtube, oauth2, youtubeAnalytics };
};

export class YoutubeProvider extends SocialAbstract implements SocialProvider {
  override maxConcurrentJob = 1; // YouTube has strict upload quotas
  identifier = 'youtube';
  name = 'YouTube';
  isBetweenSteps = false;
  scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
  ];

  editor = 'normal' as const;

  override handleErrors(body: string):
    | {
        type: 'refresh-token' | 'bad-body';
        value: string;
      }
    | undefined {
    if (body.includes('invalidTitle')) {
      return {
        type: 'bad-body',
        value:
          'We have uploaded your video but we could not set the title. Title is too long.',
      };
    }

    if (body.includes('failedPrecondition')) {
      return {
        type: 'bad-body',
        value:
          'We have uploaded your video but we could not set the thumbnail. Thumbnail size is too large.',
      };
    }

    if (body.includes('uploadLimitExceeded')) {
      return {
        type: 'bad-body',
        value:
          'You have reached your daily upload limit, please try again tomorrow.',
      };
    }

    if (body.includes('youtubeSignupRequired')) {
      return {
        type: 'bad-body',
        value:
          'You have to link your youtube account to your google account first.',
      };
    }

    if (body.includes('youtube.thumbnail')) {
      return {
        type: 'bad-body',
        value:
          'Your account is not verified, we have uploaded your video but we could not set the thumbnail. Please verify your account and try again.',
      };
    }

    return undefined;
  }

  async refreshToken(refresh_token: string): Promise<AuthTokenDetails> {
    const { client, oauth2 } = clientAndYoutube();
    client.setCredentials({ refresh_token });
    const { credentials } = await client.refreshAccessToken();
    const user = oauth2(client);
    const expiryDate = new Date(credentials.expiry_date!);
    const unixTimestamp =
      Math.floor(expiryDate.getTime() / 1000) -
      Math.floor(new Date().getTime() / 1000);

    const { data } = await user.userinfo.get();

    return {
      accessToken: credentials.access_token!,
      expiresIn: unixTimestamp!,
      refreshToken: credentials.refresh_token!,
      id: data.id!,
      name: data.name!,
      picture: data?.picture || '',
      username: '',
    };
  }

  async generateAuthUrl() {
    const state = makeId(7);
    const { client } = clientAndYoutube();
    return {
      url: client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        state,
        redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
        scope: this.scopes.slice(0),
      }),
      codeVerifier: makeId(11),
      state,
    };
  }

  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh?: string;
  }) {
    const { client, oauth2 } = clientAndYoutube();
    const { tokens } = await client.getToken(params.code);
    client.setCredentials(tokens);
    const { scopes } = await client.getTokenInfo(tokens.access_token!);
    this.checkScopes(this.scopes, scopes);

    const user = oauth2(client);
    const { data } = await user.userinfo.get();

    const expiryDate = new Date(tokens.expiry_date!);
    const unixTimestamp =
      Math.floor(expiryDate.getTime() / 1000) -
      Math.floor(new Date().getTime() / 1000);

    return {
      accessToken: tokens.access_token!,
      expiresIn: unixTimestamp,
      refreshToken: tokens.refresh_token!,
      id: data.id!,
      name: data.name!,
      picture: data?.picture || '',
      username: '',
    };
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails[]
  ): Promise<PostResponse[]> {
    const [firstPost, ...comments] = postDetails;

    console.log(`🎥 YouTube upload started for post ID: ${id}`);
    console.log(`📋 Post details:`, {
      mediaPath: firstPost?.media?.[0]?.path,
      title: firstPost.settings?.title,
      privacyStatus: firstPost.settings?.type,
      messageLength: firstPost?.message?.length
    });

    const { client, youtube } = clientAndYoutube();
    client.setCredentials({ access_token: accessToken });
    const youtubeClient = youtube(client);

    const { settings }: { settings: YoutubeSettingsDto } = firstPost;

    // Generate signed URL for private GCS bucket access
    let videoUrl = firstPost?.media?.[0]?.path;
    console.log(`🌐 Original video URL: ${videoUrl}`);
    
    // If this is a GCS URL without signature, generate signed URL
    if (videoUrl?.includes('storage.googleapis.com') && !videoUrl.includes('X-Goog-Algorithm')) {
      console.log(`🔐 Generating signed URL for private GCS access...`);
      try {
        // Extract the bucket and file path from the URL
        const urlParts = videoUrl.replace('https://storage.googleapis.com/', '').split('/');
        const bucket = urlParts[0];
        const filePath = urlParts.slice(1).join('/');
        
        console.log(`📋 GCS details: bucket=${bucket}, filePath=${filePath}`);
        
        // Import GCS and generate signed URL
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
        
        videoUrl = signedUrl;
        console.log(`✅ Generated signed URL: ${signedUrl.substring(0, 150)}...`);
      } catch (signError) {
        console.error(`❌ Failed to generate signed URL:`, (signError as any)?.message);
        console.log(`⚠️  Continuing with original URL (may fail)`);
      }
    }
    
    console.log(`🌐 Fetching video from: ${videoUrl}`);
    
    let response;
    try {
      response = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream',
        timeout: 60000, // Increase timeout to 60 seconds
      });
      
      console.log(`✅ Video fetch successful. Content-Type: ${response.headers['content-type']}, Content-Length: ${response.headers['content-length']}`);
      
    } catch (fetchError) {
      console.error(`❌ Failed to fetch video from GCS:`, fetchError);
      throw new Error(`Failed to fetch video: ${(fetchError as any)?.message || fetchError}`);
    }

    console.log(`📤 Starting YouTube API upload...`);
    console.log(`📋 Upload settings:`, {
      title: settings.title,
      privacyStatus: settings.type,
      tags: settings?.tags?.map((p) => p.label) || [],
      hasDescription: !!firstPost?.message,
      hasThumbnail: !!settings?.thumbnail?.path
    });

    const all: GaxiosResponse<Schema$Video> = await this.runInConcurrent(
      async () => {
        try {
          return await youtubeClient.videos.insert({
            part: ['id', 'snippet', 'status'],
            notifySubscribers: true,
            requestBody: {
              snippet: {
                title: settings.title,
                description: firstPost?.message,
                ...(settings?.tags?.length
                  ? { tags: settings.tags.map((p) => p.label) }
                  : {}),
              },
              status: {
                privacyStatus: settings.type,
              },
            },
            media: {
              body: response.data,
            },
          });
        } catch (uploadError) {
          console.error(`❌ YouTube API upload failed:`, {
            error: (uploadError as any)?.message,
            status: (uploadError as any)?.status,
            statusText: (uploadError as any)?.statusText,
            data: (uploadError as any)?.response?.data
          });
          throw uploadError;
        }
      },
      true
    );

    console.log(`✅ YouTube upload completed. Video ID: ${all?.data?.id}`);
    console.log(`🔗 Video URL: https://www.youtube.com/watch?v=${all?.data?.id}`);

    if (settings?.thumbnail?.path) {
      await this.runInConcurrent(async () =>
        youtubeClient.thumbnails.set({
          videoId: all?.data?.id!,
          media: {
            body: (
              await axios({
                url: settings?.thumbnail?.path,
                method: 'GET',
                responseType: 'stream',
              })
            ).data,
          },
        })
      );
    }

    return [
      {
        id: firstPost.id,
        releaseURL: `https://www.youtube.com/watch?v=${all?.data?.id}`,
        postId: all?.data?.id!,
        status: 'success',
      },
    ];
  }

  async analytics(
    id: string,
    accessToken: string,
    date: number
  ): Promise<AnalyticsData[]> {
    try {
      const endDate = dayjs().format('YYYY-MM-DD');
      const startDate = dayjs().subtract(date, 'day').format('YYYY-MM-DD');

      const { client, youtubeAnalytics } = clientAndYoutube();
      client.setCredentials({ access_token: accessToken });

      const youtubeClient = youtubeAnalytics(client);
      const { data } = await youtubeClient.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics:
          'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,subscribersLost',
        dimensions: 'day',
        sort: 'day',
      });

      const columns = data?.columnHeaders?.map((p) => p.name)!;
      const mappedData = data?.rows?.map((p) => {
        return columns.reduce((acc, curr, index) => {
          acc[curr!] = p[index];
          return acc;
        }, {} as any);
      });

      const acc = [] as any[];
      acc.push({
        label: 'Estimated Minutes Watched',
        data: mappedData?.map((p: any) => ({
          total: p.estimatedMinutesWatched,
          date: p.day,
        })),
      });

      acc.push({
        label: 'Average View Duration',
        average: true,
        data: mappedData?.map((p: any) => ({
          total: p.averageViewDuration,
          date: p.day,
        })),
      });

      acc.push({
        label: 'Average View Percentage',
        average: true,
        data: mappedData?.map((p: any) => ({
          total: p.averageViewPercentage,
          date: p.day,
        })),
      });

      acc.push({
        label: 'Subscribers Gained',
        data: mappedData?.map((p: any) => ({
          total: p.subscribersGained,
          date: p.day,
        })),
      });

      acc.push({
        label: 'Subscribers Lost',
        data: mappedData?.map((p: any) => ({
          total: p.subscribersLost,
          date: p.day,
        })),
      });

      acc.push({
        label: 'Likes',
        data: mappedData?.map((p: any) => ({
          total: p.likes,
          date: p.day,
        })),
      });

      return acc;
    } catch (err) {
      return [];
    }
  }
}
