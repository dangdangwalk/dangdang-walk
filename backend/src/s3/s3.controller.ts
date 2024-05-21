import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { User } from 'src/users/decorators/user.decorator';
import { S3Service } from './s3.service';
import { PresignedUrlInfo } from './types/s3.type';

@Controller('/api')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('/upload')
    async upload(@User() user: AccessTokenPayload, @Body() type: string[]): Promise<PresignedUrlInfo[]> {
        return await this.s3Service.createPresignedUrlWithClientForPut(user.userId, type);
    }

    @Delete('/delete')
    async delete(@User() { userId }: AccessTokenPayload, @Body() filenames: string[]): Promise<boolean> {
        await this.s3Service.deleteObjects(userId, filenames);
        return true;
    }
}
