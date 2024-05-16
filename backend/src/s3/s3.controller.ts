import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { S3Service } from './s3.service';
import { PresignedUrlInfo } from './type/s3.type';

@Controller('/api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('/upload')
    async upload(@User() user: AccessTokenPayload, @Body() type: string[]): Promise<PresignedUrlInfo[]> {
        console.log('type:', type)
        return await this.s3Service.createPresignedUrlWithClient(user.userId, type);
    }
}
