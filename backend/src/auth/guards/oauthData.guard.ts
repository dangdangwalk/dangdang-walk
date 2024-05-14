import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';

@Injectable()
export class OauthDataGuard implements CanActivate {
    constructor(private readonly logger: WinstonLoggerService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const oauthAccessToken = request.cookies['oauthAccessToken'];
        const oauthRefreshToken = request.cookies['oauthRefreshToken'];
        const oauthId = request.cookies['oauthId'];
        const provider = request.cookies['provider'];

        this.logger.log(`OauthDataGuard request cookies : ${JSON.stringify(request.cookies)}`);
        this.logger.log(`OauthDataGuard data : ${oauthAccessToken} ${oauthRefreshToken}, ${oauthId} ${provider}`);

        if (!oauthAccessToken || !oauthRefreshToken || !oauthId || !provider) {
            const e = new UnauthorizedException('OauthDataGuard failed');

            this.logger.error(`No data in cookie`, e.stack ?? 'No stack');
            throw e;
        }
        request.oauthData = { oauthAccessToken, oauthRefreshToken, oauthId, provider };

        return true;
    }
}
