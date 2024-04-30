import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { TokenService } from '../token/token.service';
import { UsersService } from 'src/users/users.service';

interface requestTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

interface requestUserInfoResponse {
    azp: string;
    aud: string;
    sub: string;
    scope: string;
    exp: string;
    expires_in: string;
    email: string;
    email_verified: string;
}

@Injectable()
export class GoogleService extends AuthService {
    constructor(
        configService: ConfigService,
        httpService: HttpService,
        tokenService: TokenService,
        usersService: UsersService
    ) {
        super(configService, httpService, tokenService, usersService, 'google');
    }

    private readonly CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    private readonly CLIENT_SECRET = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    private readonly REDIRECT_URI = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    protected async requestToken(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post<requestTokenResponse>(`https://oauth2.googleapis.com/token`, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code: autherizeCode,
                grant_type: 'authorization_code',
                redirect_uri: this.REDIRECT_URI,
            })
        );

        return data;
    }

    protected async requestUserId(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<requestUserInfoResponse>(
                `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
            )
        );

        return data.sub;
    }
}
