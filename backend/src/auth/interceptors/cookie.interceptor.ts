import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { Observable, map } from 'rxjs';
import { AuthData, OauthData } from '../auth.service';
import { TOKEN_LIFETIME_MAP } from '../token/token.service';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    constructor(private configService: ConfigService) {}

    private readonly isProduction = this.configService.get<string>('NODE_ENV') === 'prod';

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse<Response>();

                if ('accessToken' in data && 'refreshToken' in data) {
                    this.setAuthCookies(response, data);
                    this.clearOauthCookies(response);
                    return { accessToken: data.accessToken };
                } else if (
                    'oauthAccessToken' in data &&
                    'oauthRefreshToken' in data &&
                    'oauthId' in data &&
                    'provider' in data
                ) {
                    this.setOauthCookies(response, data);
                    throw new NotFoundException('회원을 찾을 수 없습니다.');
                } else {
                    this.clearAuthCookies(response);
                }
            })
        );
    }

    private setAuthCookies(response: Response, { refreshToken }: AuthData): void {
        const refreshCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: this.isProduction,
            maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
        };

        const accessCookieOptions: CookieOptions = {
            ...refreshCookieOptions,
            maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
        };

        response.cookie('refreshToken', refreshToken, refreshCookieOptions);
        response.cookie('isLoggedIn', true, accessCookieOptions);
        response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, refreshCookieOptions);
    }

    private setOauthCookies(
        response: Response,
        { oauthAccessToken, oauthRefreshToken, oauthId, provider }: OauthData
    ): void {
        const sessionCookieOptions: CookieOptions = { httpOnly: true, secure: this.isProduction };

        response.cookie('oauthAccessToken', oauthAccessToken, sessionCookieOptions);
        response.cookie('oauthRefreshToken', oauthRefreshToken, sessionCookieOptions);
        response.cookie('oauthId', oauthId, sessionCookieOptions);
        response.cookie('provider', provider, sessionCookieOptions);
    }

    private clearAuthCookies(response: Response): void {
        response.clearCookie('refreshToken');
        response.clearCookie('isLoggedIn');
        response.clearCookie('expiresIn');
    }

    private clearOauthCookies(response: Response): void {
        response.clearCookie('oauthAccessToken');
        response.clearCookie('oauthRefreshToken');
        response.clearCookie('oauthId');
        response.clearCookie('provider');
    }
}
