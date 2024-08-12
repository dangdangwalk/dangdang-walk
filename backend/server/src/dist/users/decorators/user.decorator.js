"use strict";
Object.defineProperty(exports, "User", {
    enumerable: true,
    get: function() {
        return User;
    }
});
const _common = require("@nestjs/common");
const User = (0, _common.createParamDecorator)((data, context)=>{
    const request = context.switchToHttp().getRequest();
    return request.user;
});

//# sourceMappingURL=user.decorator.js.map