import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RedirectUrl = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.session.redirectUrl;
});
