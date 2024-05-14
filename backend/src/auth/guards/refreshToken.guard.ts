import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
import { RefreshTokenPayload, TokenService } from '../token/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService,
        private logger: WinstonLoggerService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['refreshToken'];

        if (!token) {
            const e = new UnauthorizedException();

            this.logger.error(`No refreshToken inside cookie`, e.stack ?? 'No Stack');

            throw e;
        }

        try {
            const payload = this.tokenService.verify(token) as RefreshTokenPayload;
            const isValid = await this.authService.validateRefreshToken(token, payload.oauthId);

            request.user = payload;

            return isValid;
        } catch {
            const e = new UnauthorizedException();

            this.logger.error(`Invalid RefreshToken`, e.stack ?? 'No Stack');

            throw e;
        }
    }
}
