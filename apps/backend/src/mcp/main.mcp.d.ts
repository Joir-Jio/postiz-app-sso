import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
export declare class MainMcp {
    private _integrationService;
    private _postsService;
    private _openAiService;
    constructor(_integrationService: IntegrationService, _postsService: PostsService, _openAiService: OpenaiService);
    preRun(): Promise<{
        type: string;
        text: string;
    }[]>;
    listOfProviders(organization: string): Promise<{
        type: string;
        text: string;
    }[]>;
    schedulePost(organization: string, obj: {
        type: 'draft' | 'schedule';
        generatePictures: boolean;
        date: string;
        providerId: string;
        posts: {
            text: string;
        }[];
    }): Promise<{
        type: string;
        text: string;
    }[]>;
}
