import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';

@Injectable()
export class OauthDataGuard implements CanActivate {
    constructor(private readonly logger: WinstonLoggerService) {}
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

            const error = new UnauthorizedException(`OAuth data missing in cookies: ${missingFields}.`);
            this.logger.error(`OAuthDataGuard failed: missing ${missingFields}.`, { trace: error.stack ?? 'No stack' });
            throw error;
        }

        return { oauthAccessToken, oauthRefreshToken, provider };
    }
}
