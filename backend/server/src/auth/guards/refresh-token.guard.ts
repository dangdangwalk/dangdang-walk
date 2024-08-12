import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractRefreshTokenFromCookie(request);

        try {
            request.user = await this.authService.validateRefreshToken(token);

            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                const trace = { trace: error.stack ?? 'No stack' };
                error = new UnauthorizedException(error.message);
                this.logger.error(error.message, trace);
                throw error;
            } else {
                error = new UnauthorizedException();
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            }
        }
    }

    private extractRefreshTokenFromCookie(request: any): string {
        const token = request.cookies['refreshToken'];

        if (!token) {
            const error = new UnauthorizedException('쿠키에 refreshToken이 없습니다');
            this.logger.error(`쿠키에 refreshToken이 없습니다`, { trace: error.stack ?? '스택 없음' });
            throw error;
        }

        return token;
    }
}
