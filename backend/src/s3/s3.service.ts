import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { generateUuid } from 'src/utils/hash.utils';

@Injectable()
export class S3Service {
    private readonly s3Client;
    constructor(private readonly configService: ConfigService) {
        this.s3Client = new AWS.S3({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }

    makeFileName(userId: number, type: string): string {
        return `${userId}/${generateUuid()}.${type}`;
    }

    async createPresignedUrlWithClient(userId: number, type: string): Promise<any> {
        const key = this.makeFileName(userId, type);
        const url = await this.s3Client.getSignedUrlPromise('putObject', {
            Bucket: 'dangdangwalk',
            Key: key,
            Body: type,
        });
        return { key, url };
    }
}
