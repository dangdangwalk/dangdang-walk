import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
            const e = new UnauthorizedException('There is no token in header');
            this.logger.error(`No token in header`, e.stack ?? 'No stack');

            throw e;
        }
        try {
            const payload = this.tokenService.verify(token) as AccessTokenPayload;
            this.logger.log(`Payload : ${payload}`);
            const isValid = await this.authService.validateAccessToken(payload.userId);

            request.user = payload;

            return isValid;
        } catch {
            const e = new UnauthorizedException('There is no matched user');
            this.logger.error(`No user matched`, e.stack ?? 'No stack');
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
