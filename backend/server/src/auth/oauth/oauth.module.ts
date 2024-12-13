import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { GoogleService } from './google.service';
import { KakaoService } from './kakao.service';
import { NaverService } from './naver.service';
import { OauthService } from './oauth.service.interface';

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: 'OAUTH_SERVICES',
            useFactory: (googleService: GoogleService, kakaoService: KakaoService, naverService: NaverService) => {
                const oauthServices = new Map<string, OauthService>();
                oauthServices.set('google', googleService);
                oauthServices.set('kakao', kakaoService);
                oauthServices.set('naver', naverService);
                return oauthServices;
            },
            inject: [GoogleService, KakaoService, NaverService],
        },
        GoogleService,
        KakaoService,
        NaverService,
    ],
    exports: ['OAUTH_SERVICES'],
})
export class OauthModule {}
