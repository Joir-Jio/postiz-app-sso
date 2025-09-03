import { IUploadProvider } from './upload.interface';
export declare class UploadFactory {
    static createStorage(): IUploadProvider;
    private static createGCSStorage;
}
