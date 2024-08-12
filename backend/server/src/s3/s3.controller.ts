import { Body, Controller, Delete, HttpCode, ParseArrayPipe, Post } from '@nestjs/common';

import { FileType, FileTypeValidationPipe } from './pipes/file-type-validation.pipe';
import { S3Service } from './s3.service';

import { PresignedUrlInfo } from './types/presigned-url-info.type';

import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';

@Controller('/images')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('/presigned-url')
    @HttpCode(200)
    async presignedUrl(
        @User() user: AccessTokenPayload,
        @Body(new FileTypeValidationPipe()) type: FileType[],
    ): Promise<PresignedUrlInfo[]> {
        return await this.s3Service.createPresignedUrlWithClientForPut(user.userId, type);
    }

    @Delete()
    @HttpCode(204)
    async delete(
        @User() { userId }: AccessTokenPayload,
        @Body(new ParseArrayPipe({ items: String, separator: ',' })) filenames: string[],
    ) {
        await this.s3Service.deleteObjects(userId, filenames);
    }
}
