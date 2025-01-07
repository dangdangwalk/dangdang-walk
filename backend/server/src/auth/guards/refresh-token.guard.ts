import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractRefreshTokenFromCookie(request);

        try {
            request.user = await this.authService.validateRefreshToken(token);

            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                throw new UnauthorizedException(error.message, { cause: error });
            } else {
                throw new UnauthorizedException();
            }
        }
    }

    private extractRefreshTokenFromCookie(request: any): string {
        const token = request.cookies['refreshToken'];

        if (!token) {
            throw new UnauthorizedException('쿠키에 refreshToken이 없습니다');
        }

        return token;
    }
}
