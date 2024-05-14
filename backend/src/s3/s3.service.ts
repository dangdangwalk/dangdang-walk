import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { generateUuid } from 'src/utils/hash.utils';
import { PresignedUrlInfo } from './type/s3.type';

@Injectable()
export class S3Service {
    private readonly s3Client;
    constructor(private readonly configService: ConfigService) {
        this.s3Client = new AWS.S3({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }

    makeFileName(userId: number, type: string): string {
        return `${userId}/${generateUuid()}.${type}`;
    }

    //TODO: 이 로그 지우기
    async createPresignedUrlWithClient(userId: number, type: string): Promise<PresignedUrlInfo> {
        const key = this.makeFileName(userId, type);
        const url = await this.s3Client.getSignedUrlPromise('putObject', {
            Bucket: 'dangdangwalk',
            ContentType: `image/${type}`,
            Key: key,
        });
        return { key, url };
    }
}
