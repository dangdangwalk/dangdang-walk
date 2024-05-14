import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';
import { AuthService } from '../auth.service';
import { SKIP } from '../decorators/public.decorator';
import { AccessTokenPayload, TokenService } from '../token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService,
        private reflector: Reflector,
        private logger: WinstonLoggerService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipAuthGuard = this.reflector.getAllAndOverride<boolean>(SKIP, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipAuthGuard) return true;

        const request = context.switchToHttp().getRequest();
        if (request.url === '/metrics') return true;

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            const error = new UnauthorizedException('Token does not exist in Authorization header.');
            this.logger.error(`Authorization header is missing or empty.`, error.stack ?? 'No stack');
            throw error;
        }

        try {
            const payload = this.tokenService.verify(token) as AccessTokenPayload;
            this.logger.log(`Payload: ${JSON.stringify(payload)}`);

            const isValid = await this.authService.validateAccessToken(payload.userId);

            request.user = payload;

            return isValid;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                throw error;
            } else {
                error = new UnauthorizedException('No matching user found.');
                this.logger.error(`No matching user found`, error.stack ?? 'No stack');
                throw error;
            }
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
