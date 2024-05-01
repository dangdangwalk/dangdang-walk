import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenPayload, TokenService } from '../token/token.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['refreshToken'];

        if (!token) throw new UnauthorizedException();

        try {
            const payload = this.tokenService.verify(token) as RefreshTokenPayload;
            const isValid = this.authService.validateRefreshToken(token, payload.oauthId);

            request.user = payload;

            return isValid;
        } catch {
            throw new UnauthorizedException();
        }
    }
}
