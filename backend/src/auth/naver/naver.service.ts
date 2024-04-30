import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { TokenService } from '../token/token.service';
import { UsersService } from 'src/users/users.service';

interface requestTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

interface requestUserInfoResponse {
    resultcode: string;
    message: string;
    response: {
        id: string;
        [key: string]: any;
    };
}

@Injectable()
export class NaverService extends AuthService {
    constructor(
        configService: ConfigService,
        httpService: HttpService,
        tokenService: TokenService,
        usersService: UsersService
    ) {
        super(configService, httpService, tokenService, usersService, 'naver');
    }

    private readonly CLIENT_ID = this.configService.get<string>('NAVER_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('NAVER_CLIENT_SECRET');

    protected async requestToken(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(
                `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&code=${autherizeCode}&state=naverLoginState`
            )
        );

        return data;
    }

    protected async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>('https://openapi.naver.com/v1/nid/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        );

        return data.response.id;
    }
}
