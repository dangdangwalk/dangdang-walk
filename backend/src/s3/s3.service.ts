import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateUuid } from 'src/utils/hash.utils';
import { PresignedUrlInfo } from './type/s3.type';

@Injectable()
export class S3Service {
    private readonly s3Client;
    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }

    makeFileName(userId: number, type: string[]): string[] {
        return type.map((curType) => `${userId}/${generateUuid()}.${curType}`);
    }

    async createPresignedUrlWithClient(userId: number, type: string[]): Promise<PresignedUrlInfo[]> {
        const filenameArray = this.makeFileName(userId, type);
        const presignedUrlInfoPromises = await filenameArray.map(async (curFileName) => {
            const command = new PutObjectCommand({
                Bucket: 'dangdangwalk',
                ContentType: `image/${type}`,
                Key: curFileName,
            });
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
            return { filename: curFileName, url };
        });
        return Promise.all(presignedUrlInfoPromises);
    }
}
