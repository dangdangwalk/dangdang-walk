import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { GoogleService } from './google.service';
import { KakaoService } from './kakao.service';
import { NaverService } from './naver.service';

@Module({
    imports: [HttpModule],
    providers: [GoogleService, KakaoService, NaverService],
    exports: [GoogleService, KakaoService, NaverService],
})
export class OauthModule {}
