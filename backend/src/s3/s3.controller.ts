import { Controller, Get, Query } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { S3Service } from './s3.service';

@Controller('/api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get('/upload')
    upload(@User() user: AccessTokenPayload, @Query('type') type: string) {
        return this.s3Service.createPresignedUrlWithClient(user.userId, type);
    }
}
