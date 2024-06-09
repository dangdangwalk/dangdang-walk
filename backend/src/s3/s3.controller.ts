import { Body, Controller, Delete, HttpCode, ParseArrayPipe, Post } from '@nestjs/common';

import { S3Service } from './s3.service';

import { PresignedUrlInfo } from './types/presigned-url-info.type';

import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';

@Controller('/api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('/upload')
    @HttpCode(200)
    async upload(
        @User() user: AccessTokenPayload,
        @Body(new ParseArrayPipe({ items: String, separator: ',' })) type: string[],
    ): Promise<PresignedUrlInfo[]> {
        return await this.s3Service.createPresignedUrlWithClientForPut(user.userId, type);
    }

    @Delete('/delete')
    async delete(
        @User() { userId }: AccessTokenPayload,
        @Body(new ParseArrayPipe({ items: String, separator: ',' })) filenames: string[],
    ): Promise<boolean> {
        await this.s3Service.deleteObjects(userId, filenames);
        return true;
    }
}
