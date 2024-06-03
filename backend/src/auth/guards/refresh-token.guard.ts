import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
import { RefreshTokenPayload, TokenService } from '../token/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService,
        private logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['refreshToken'];

        if (!token) {
            const error = new UnauthorizedException('Refresh token not found in cookies.');
            this.logger.error(`No refreshToken inside cookie.`, error.stack ?? 'No stack');
            throw error;
        }

        try {
            const payload = this.tokenService.verify(token) as RefreshTokenPayload;
            const isValid = await this.authService.validateRefreshToken(token, payload.oauthId);

            request.user = payload;

            return isValid;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                const trace = error.stack ?? 'No stack';
                error = new UnauthorizedException(error.message);
                this.logger.error(error.message, trace);
                throw error;
            } else {
                error = new UnauthorizedException('No matching user found.');
                this.logger.error(`No matching user found`, error.stack ?? 'No stack');
                throw error;
            }
        }
    }
}
