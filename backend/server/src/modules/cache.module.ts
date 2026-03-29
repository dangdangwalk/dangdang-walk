import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
    imports: [NestCacheModule.register({ isGlobal: true })],
})
export class CacheModule {}
