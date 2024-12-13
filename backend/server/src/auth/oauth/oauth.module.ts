import { HttpModule } from '@nestjs/axios';
import { Module, Type } from '@nestjs/common';

import { GoogleService } from './google.service';
import { KakaoService } from './kakao.service';
import { NaverService } from './naver.service';
import { OauthService } from './oauth.service.interface';

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
            useFactory: () => {
                const oauthServices = new Map<string, OauthService>();

                for (const [provider, ServiceClass] of OAUTH_REGISTRY) {
                    oauthServices.set(provider, new ServiceClass());
                }

                return oauthServices;
            },
        },
        GoogleService,
        KakaoService,
        NaverService,
    ],
    exports: ['OAUTH_SERVICES'],
})
export class OauthModule {}
