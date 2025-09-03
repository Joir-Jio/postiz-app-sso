import { Request, Response } from 'express';
export default function handleR2Upload(endpoint: string, req: Request, res: Response): Promise<import("@aws-sdk/client-s3").CompleteMultipartUploadCommandOutput | Response<any, Record<string, any>>>;
export declare function simpleUpload(data: Buffer, originalFilename: string, contentType: string): Promise<string>;
export declare function createMultipartUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function prepareUploadParts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listParts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function completeMultipartUpload(req: Request, res: Response): Promise<import("@aws-sdk/client-s3").CompleteMultipartUploadCommandOutput | Response<any, Record<string, any>>>;
export declare function abortMultipartUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function signPart(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
