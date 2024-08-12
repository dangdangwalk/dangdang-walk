"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthCookies = void 0;
const common_1 = require("@nestjs/common");
exports.OauthCookies = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    return request.oauthData;
});
//# sourceMappingURL=oauth-data.decorator.js.map