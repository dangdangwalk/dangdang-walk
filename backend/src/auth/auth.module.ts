import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { KakaoController } from './kakao/kakao.controller';
import { KakaoService } from './kakao/kakao.service';
import { NaverService } from './naver/naver.service';
import { NaverController } from './naver/naver.controller';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { TokenService } from './token/token.service';

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
    controllers: [KakaoController, NaverController, GoogleController],
    providers: [TokenService, KakaoService, NaverService, GoogleService],
})
export class AuthModule {}
