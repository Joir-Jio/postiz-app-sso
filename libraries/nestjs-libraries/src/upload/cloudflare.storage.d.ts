import 'multer';
import { IUploadProvider } from './upload.interface';
declare class CloudflareStorage implements IUploadProvider {
    private region;
    private _bucketName;
    private _uploadUrl;
    private _client;
    constructor(accountID: string, accessKey: string, secretKey: string, region: string, _bucketName: string, _uploadUrl: string);
    uploadSimple(path: string): Promise<string>;
    uploadFile(file: Express.Multer.File): Promise<any>;
    removeFile(filePath: string): Promise<void>;
}
export { CloudflareStorage };
export default CloudflareStorage;
