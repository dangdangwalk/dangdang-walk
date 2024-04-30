// auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        UsersModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [AuthService],
})
export class AuthModule {}
