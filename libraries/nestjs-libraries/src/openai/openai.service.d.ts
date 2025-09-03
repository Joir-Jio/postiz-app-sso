export declare class OpenaiService {
    generateImage(prompt: string, isUrl: boolean, isVertical?: boolean): Promise<string>;
    generatePromptForPicture(prompt: string): Promise<string>;
    generateVoiceFromText(prompt: string): Promise<string>;
    generatePosts(content: string): Promise<any[]>;
    extractWebsiteText(content: string): Promise<any[]>;
    separatePosts(content: string, len: number): Promise<{
        posts: any[];
    }>;
    generateSlidesFromText(text: string): Promise<{
        imagePrompt?: string;
        voiceText?: string;
    }[]>;
}
