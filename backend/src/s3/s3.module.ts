import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
    controllers: [S3Controller],
    providers: [S3Service, ConfigModule],
})
export class S3Module {}
