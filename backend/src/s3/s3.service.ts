import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileType } from './pipes/file-type-validation.pipe';
import { PresignedUrlInfo } from './types/presigned-url-info.type';

import { WinstonLoggerService } from '../common/logger/winstonLogger.service';
import { generateUuid } from '../utils/hash.util';

const BUCKET_NAME = 'dangdangbucket';

@Injectable()
export class S3Service {
    private readonly s3Client;
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: WinstonLoggerService,
    ) {
        this.s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }

    private makeFileName(userId: number, type: FileType[]): string[] {
        return type.map((curType) => `${userId}/${generateUuid()}.${curType}`);
    }

    async createPresignedUrlWithClientForPut(userId: number, type: FileType[]): Promise<PresignedUrlInfo[]> {
        const filenameArray = this.makeFileName(userId, type);
        const presignedUrlInfoPromises = filenameArray.map(async (curFileName) => {
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
        if (parseInt(filenameSplit[0]) !== userId) {
            return false;
        }
        return true;
    }

    async deleteObjects(userId: number, filenames: string[]) {
        const objectArray: {
            Key: string;
        }[] = [];

        for (const curFilename of filenames) {
            if (curFilename.startsWith('default/')) continue;

            if (!this.checkUserIdInFilename(userId, curFilename)) {
                throw new ForbiddenException(`유저 ${userId}은 이미지 ${curFilename}에 대한 접근 권한이 없습니다`);
            }

            objectArray.push({ Key: curFilename });
        }

        const input = {
            Bucket: BUCKET_NAME,
            Delete: {
                Objects: objectArray,
            },
        };

        const command = new DeleteObjectsCommand(input);
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filenames} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filenames} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }

    async deleteSingleObject(userId: number, filename: string) {
        if (filename.startsWith('default/')) return;

        if (!this.checkUserIdInFilename(userId, filename)) {
            throw new ForbiddenException(`유저 ${userId}은/는 ${filename}에 대한 접근 권한이 없습니다`);
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });

        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }

    async deleteObjectFolder(userId: number) {
        const filename = `${userId.toString()}/`;

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });

        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }
}
