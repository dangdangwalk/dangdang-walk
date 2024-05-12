import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OauthData } from '../auth.service';

export const OauthCookies = createParamDecorator((data: never, context: ExecutionContext): OauthData => {
    const request = context.switchToHttp().getRequest();
    return request.oauthData;
});
