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

    private readonly refreshCookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: this.isProduction ? 'none' : 'lax',
        secure: this.isProduction,
        maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
    };

    private readonly accessCookieOptions: CookieOptions = {
        sameSite: this.isProduction ? 'none' : 'lax',
        secure: this.isProduction,
        maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
    };

    private readonly sessionCookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: this.isProduction ? 'none' : 'lax',
        secure: this.isProduction,
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
                } else if (
                    'oauthAccessToken' in data &&
                    'oauthRefreshToken' in data &&
                    'oauthId' in data &&
                    'provider' in data
                ) {
                    this.setOauthCookies(response, data);
                    throw new NotFoundException('회원을 찾을 수 없습니다.');
                }
            })
        );
    }

    private setAuthCookies(response: Response, { refreshToken }: AuthData): void {
        response.cookie('refreshToken', refreshToken, this.refreshCookieOptions);
        response.cookie('isLoggedIn', true, this.accessCookieOptions);
        response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, this.accessCookieOptions);
    }

    private setOauthCookies(
        response: Response,
        { oauthAccessToken, oauthRefreshToken, oauthId, provider }: OauthData
    ): void {
        response.cookie('oauthAccessToken', oauthAccessToken, this.sessionCookieOptions);
        response.cookie('oauthRefreshToken', oauthRefreshToken, this.sessionCookieOptions);
        response.cookie('oauthId', oauthId, this.sessionCookieOptions);
        response.cookie('provider', provider, this.sessionCookieOptions);
    }

    private clearAuthCookies(response: Response): void {
        response.clearCookie('refreshToken', this.refreshCookieOptions);
        response.clearCookie('isLoggedIn', this.accessCookieOptions);
        response.clearCookie('expiresIn', this.accessCookieOptions);
    }

    private clearOauthCookies(response: Response): void {
        response.clearCookie('oauthAccessToken', this.sessionCookieOptions);
        response.clearCookie('oauthRefreshToken', this.sessionCookieOptions);
        response.clearCookie('oauthId', this.sessionCookieOptions);
        response.clearCookie('provider', this.sessionCookieOptions);
    }
}
