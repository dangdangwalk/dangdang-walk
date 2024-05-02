import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload, TokenService } from '../token/token.service';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { SKIP } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private authService: AuthService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipAuthGuard = this.reflector.getAllAndOverride<boolean>(SKIP, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipAuthGuard) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException();

        try {
            const payload = this.tokenService.verify(token) as AccessTokenPayload;
            const isValid = await this.authService.validateAccessToken(payload.userId);

            request.user = payload;

            return isValid;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
