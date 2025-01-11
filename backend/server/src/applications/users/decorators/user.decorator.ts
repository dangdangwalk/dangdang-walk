import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AccessTokenPayload, RefreshTokenPayload } from '../../auth/token/token.service';

export const User = createParamDecorator(
    (data: never, context: ExecutionContext): AccessTokenPayload | RefreshTokenPayload => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);
