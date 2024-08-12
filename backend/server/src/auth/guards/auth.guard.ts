import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
import { SKIP } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
        private logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.shouldSkipAuthGuard(context)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractAccessTokenFromHeader(request);
        try {
            request.user = await this.authService.validateAccessToken(token);

            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                error = new UnauthorizedException(error.message);
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            } else {
                error = new UnauthorizedException();
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            }
        }
    }

    private shouldSkipAuthGuard(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const skipAuthGuard = this.reflector.getAllAndOverride<boolean>(SKIP, [
            context.getHandler(),
            context.getClass(),
        ]);

        return skipAuthGuard || request.url === '/metrics';
    }

    private extractAccessTokenFromHeader(request: Request): string {
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            const error = new UnauthorizedException('헤더에 Authorization 필드가 없습니다');
            this.logger.error(`헤더에 Authorization 필드가 없습니다`, { trace: error.stack ?? 'No stack' });
            throw error;
        }

        const [type, token] = authorizationHeader.split(' ');

        if (!token || type !== 'Bearer') {
            const error = new UnauthorizedException(
                'Token does not exist in Authorization header or is in an invalid format.',
            );
            this.logger.error(`헤더의 Authorization 필드에 토큰이 없거나, 형식이 잘못되었습니다`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return token;
    }
}
