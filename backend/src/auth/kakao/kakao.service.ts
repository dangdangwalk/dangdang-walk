import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { TokenService } from '../token/token.service';
import { UsersService } from 'src/users/users.service';

interface requestTokenResponse {
    token_type: string;
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope?: string;
}

interface requestUserInfoResponse {
    id: number;
    expires_in: number;
    app_id: number;
}

@Injectable()
export class KakaoService extends AuthService {
    constructor(
        configService: ConfigService,
        httpService: HttpService,
        tokenService: TokenService,
        usersService: UsersService
    ) {
        super(configService, httpService, tokenService, usersService, 'kakao');
    }

    private readonly CLIENT_ID = this.configService.get<string>('KAKAO_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('KAKAO_CLIENT_SECRET');
    private readonly REDIRECT_URI = this.configService.get<string>('KAKAO_REDIRECT_URI');

    protected async requestToken(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(
                'https://kauth.kakao.com/oauth/token',
                {
                    code: autherizeCode,
                    grant_type: 'authorization_code',
                    client_id: this.CLIENT_ID,
                    redirect_uri: this.REDIRECT_URI,
                    client_secret: this.CLIENT_SECRET,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                }
            )
        );

        return data;
    }

    protected async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>('https://kapi.kakao.com/v1/user/access_token_info', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.id.toString();
    }
}
