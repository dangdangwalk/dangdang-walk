import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { generateUuid } from 'src/utils/hash.utils';
import { PresignedUrlInfo } from './type/s3.type';

const BUCKET_NAME = 'dangdangwalk';

@Injectable()
export class S3Service {
    private readonly s3Client;
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: WinstonLoggerService
    ) {
        this.s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }

    makeFileName(userId: number, type: string[]): string[] {
        return type.map((curType) => `${userId}/${generateUuid()}.${curType}`);
    }

    async createPresignedUrlWithClientForPut(userId: number, type: string[]): Promise<PresignedUrlInfo[]> {
        const filenameArray = this.makeFileName(userId, type);
        const presignedUrlInfoPromises = await filenameArray.map(async (curFileName) => {
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                ContentType: `image/${type}`,
                Key: curFileName,
            });
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
            return { filename: curFileName, url };
        });
        return Promise.all(presignedUrlInfoPromises);
    }

    private checkUserIdInFilename(userId: number, filename: string): boolean {
        const filenameSplit = filename.split('/');
        console.log('fileUSerId :', `${parseInt(filenameSplit[0])}`);
        console.log('usrId:', userId);
        if (parseInt(filenameSplit[0]) !== userId) {
            return false;
        }
        return true;
    }

    async createPresignedUrlWithClientForDelete(userId: number, filename: string): Promise<PresignedUrlInfo> {
        //TODO : guard로 바꾸기
        console.log('userId:', userId, 'filename:', filename);
        if (!this.checkUserIdInFilename(userId, filename)) {
            throw new UnauthorizedException(`User ${userId} is not owner of the file ${filename}`);
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        return { filename, url };
    }

    async deleteSingleObject(filename: string) {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });

        try {
            const response = await this.s3Client.send(command);
            this.logger.log(`Successfuly deleted ${filename}`);
        } catch (error) {
            this.logger.error(`Can't delete ${filename} from S3 bucket ${BUCKET_NAME}`, error ?? error.stack);
        }
    }
}
