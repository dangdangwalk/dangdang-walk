"use strict";
Object.defineProperty(exports, "OauthCookies", {
    enumerable: true,
    get: function() {
        return OauthCookies;
    }
});
const _common = require("@nestjs/common");
const OauthCookies = (0, _common.createParamDecorator)((data, context)=>{
    const request = context.switchToHttp().getRequest();
    return request.oauthData;
});

//# sourceMappingURL=oauth-data.decorator.js.map