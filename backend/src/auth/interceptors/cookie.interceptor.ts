import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { TOKEN_LIFETIME_MAP } from '../token/token.service';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    constructor(private configService: ConfigService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'prod';

        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse<Response>();

                if (data) {
                    const { accessToken, refreshToken } = data;

                    response.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: isProduction,
                        maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
                    });

                    response.cookie('isLoggedIn', true, {
                        secure: isProduction,
                        maxAge: TOKEN_LIFETIME_MAP.access.maxAge,
                    });

                    response.cookie('expiresIn', TOKEN_LIFETIME_MAP.access.maxAge, {
                        secure: isProduction,
                        maxAge: TOKEN_LIFETIME_MAP.refresh.maxAge,
                    });

                    return { accessToken };
                } else {
                    response.clearCookie('refreshToken');
                    response.clearCookie('isLoggedIn');
                    response.clearCookie('expiresIn');
                }
            })
        );
    }
}
