import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OauthDataGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const oauthAccessToken = request.cookies['oauthAccessToken'];
        const oauthRefreshToken = request.cookies['oauthRefreshToken'];
        const oauthId = request.cookies['oauthId'];
        const provider = request.cookies['provider'];

        if (!oauthAccessToken || !oauthRefreshToken || !oauthId || !provider) throw new UnauthorizedException();

        request.oauthData = { oauthAccessToken, oauthRefreshToken, oauthId, provider };

        return true;
    }
}
