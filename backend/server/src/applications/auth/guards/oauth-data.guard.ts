import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OauthDataGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const oauthData = this.extractOauthDataFromCookies(request);

        request.oauthData = oauthData;

        return true;
    }

    private extractOauthDataFromCookies(request: any) {
        const oauthAccessToken = request.cookies['oauthAccessToken'];
        const oauthRefreshToken = request.cookies['oauthRefreshToken'];
        const provider = request.cookies['provider'];

        if (!oauthAccessToken || !oauthRefreshToken || !provider) {
            const missingFields = [
                !oauthAccessToken && 'oauthAccessToken',
                !oauthRefreshToken && 'oauthRefreshToken',
                !provider && 'provider',
            ]
                .filter(Boolean)
                .join(', ');

            throw new UnauthorizedException(`쿠키에 OAuth 데이터(${missingFields})가 없습니다`);
        }

        return { oauthAccessToken, oauthRefreshToken, provider };
    }
}
