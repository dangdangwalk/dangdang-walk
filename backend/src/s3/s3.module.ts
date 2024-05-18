import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
    controllers: [S3Controller],
    providers: [S3Service],
    exports: [S3Service],
})
export class S3Module {}
