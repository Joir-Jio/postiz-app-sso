import { IUploadProvider } from './upload.interface';
export declare class LocalStorage implements IUploadProvider {
    private uploadDirectory;
    constructor(uploadDirectory: string);
    uploadSimple(path: string): Promise<string>;
    uploadFile(file: Express.Multer.File): Promise<any>;
    removeFile(filePath: string): Promise<void>;
}
