export interface IUploadProvider {
    uploadSimple(path: string): Promise<string>;
    uploadFile(file: Express.Multer.File): Promise<any>;
    removeFile(filePath: string): Promise<void>;
}
export interface IExtendedUploadProvider extends IUploadProvider {
    referenceFile?(options: {
        filePath: string;
        userId?: string;
        validatePath?: boolean;
        generateThumbnail?: boolean;
        skipSizeCheck?: boolean;
    }): Promise<any>;
    fileExists?(filePath: string): Promise<boolean>;
    getFileInfo?(filePath: string, userId?: string): Promise<{
        name: string;
        size: number;
        contentType: string;
        lastModified: Date;
        etag: string;
        exists: boolean;
        signedUrl?: string;
        thumbnailUrl?: string;
    }>;
    listFiles?(prefix: string, userId?: string, maxResults?: number): Promise<{
        name: string;
        size: number;
        contentType: string;
        lastModified: Date;
        etag: string;
        exists: boolean;
    }[]>;
    clearCaches?(): void;
    getConfig?(): any;
}
