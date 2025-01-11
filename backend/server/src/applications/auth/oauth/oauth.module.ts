import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, Type } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { WinstonLoggerService } from 'shared/logger';

import { GoogleService } from './google.service';
import { KakaoService } from './kakao.service';
import { NaverService } from './naver.service';
import { OauthService } from './oauth.service.base';

export const OAUTH_REGISTRY = new Map<string, Type<OauthService>>([
    ['google', GoogleService],
    ['kakao', KakaoService],
    ['naver', NaverService],
]);

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: 'OAUTH_SERVICES',
            useFactory: (configService: ConfigService, httpService: HttpService, logger: WinstonLoggerService) => {
                const oauthServices = new Map<string, OauthService>();

                for (const [provider, ServiceClass] of OAUTH_REGISTRY) {
                    oauthServices.set(provider, new ServiceClass(configService, httpService, logger));
                }

                return oauthServices;
            },
            inject: [ConfigService, HttpService, WinstonLoggerService],
        },
        GoogleService,
        KakaoService,
        NaverService,
    ],
    exports: ['OAUTH_SERVICES'],
})
export class OauthModule {}
