import { FileType } from './pipes/file-type-validation.pipe';
import { S3Service } from './s3.service';
import { PresignedUrlInfo } from './types/presigned-url-info.type';
import { AccessTokenPayload } from '../auth/token/token.service';
export declare class S3Controller {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    presignedUrl(user: AccessTokenPayload, type: FileType[]): Promise<PresignedUrlInfo[]>;
    delete({ userId }: AccessTokenPayload, filenames: string[]): Promise<void>;
}
