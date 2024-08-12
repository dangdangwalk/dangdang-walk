import { ConfigService } from '@nestjs/config';
import { FileType } from './pipes/file-type-validation.pipe';
import { PresignedUrlInfo } from './types/presigned-url-info.type';
import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
export declare class S3Service {
    private readonly configService;
    private readonly logger;
    private readonly s3Client;
    constructor(configService: ConfigService, logger: WinstonLoggerService);
    private makeFileName;
    createPresignedUrlWithClientForPut(userId: number, type: FileType[]): Promise<PresignedUrlInfo[]>;
    private checkUserIdInFilename;
    deleteObjects(userId: number, filenames: string[]): Promise<void>;
    deleteSingleObject(userId: number, filename: string): Promise<void>;
    deleteObjectFolder(userId: number): Promise<void>;
}
