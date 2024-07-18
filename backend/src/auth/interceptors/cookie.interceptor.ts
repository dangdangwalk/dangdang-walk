import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { Observable, map } from 'rxjs';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { TokenService } from '../token/token.service';
import { AuthData } from '../types/auth-data.type';
import { OauthData } from '../types/oauth-data.type';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    constructor(
        private configService: ConfigService,
        private logger: WinstonLoggerService,
    ) {}

    private readonly isProduction = this.configService.get<string>('NODE_ENV') === 'prod';

    private readonly sessionCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: this.isProduction,
        sameSite: 'lax',
    };

    private readonly refreshCookieOptions: CookieOptions = {
        ...this.sessionCookieOptions,
        maxAge: TokenService.TOKEN_LIFETIME_MAP.refresh.maxAge,
    };

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse<Response>();

                if (!data) {
                    this.clearAuthCookies(response);
                    return;
                }

                if ('accessToken' in data && 'refreshToken' in data) {
                    this.setAuthCookies(response, data);
                    this.clearOauthCookies(response);
                    return { accessToken: data.accessToken };
                } else if ('oauthAccessToken' in data && 'oauthRefreshToken' in data && 'provider' in data) {
                    this.setOauthCookies(response, data);

                    const error = new NotFoundException('일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요');
                    this.logger.error(
                        `일치하는 유저를 찾을 수 없습니다. 계정을 생성해주세요`,
                        error.stack ?? '스택 없음',
                    );
                    throw error;
                }
            }),
        );
    }

    private setAuthCookies(response: Response, { refreshToken }: AuthData): void {
        response.cookie('refreshToken', refreshToken, this.refreshCookieOptions);
    }

    private setOauthCookies(response: Response, { oauthAccessToken, oauthRefreshToken, provider }: OauthData): void {
        response.cookie('oauthAccessToken', oauthAccessToken, this.sessionCookieOptions);
        response.cookie('oauthRefreshToken', oauthRefreshToken, this.sessionCookieOptions);
        response.cookie('provider', provider, this.sessionCookieOptions);
    }

    private clearAuthCookies(response: Response): void {
        response.clearCookie('refreshToken', this.refreshCookieOptions);
    }

    private clearOauthCookies(response: Response): void {
        response.clearCookie('oauthAccessToken', this.sessionCookieOptions);
        response.clearCookie('oauthRefreshToken', this.sessionCookieOptions);
        response.clearCookie('provider', this.sessionCookieOptions);
    }
}
