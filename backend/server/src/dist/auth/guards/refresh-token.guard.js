"use strict";
Object.defineProperty(exports, "RefreshTokenGuard", {
    enumerable: true,
    get: function() {
        return RefreshTokenGuard;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _authservice = require("../auth.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RefreshTokenGuard = class RefreshTokenGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractRefreshTokenFromCookie(request);
        try {
            request.user = await this.authService.validateRefreshToken(token);
            return true;
        } catch (error) {
            if (error instanceof _jwt.TokenExpiredError || error instanceof _jwt.JsonWebTokenError) {
                var _error_stack;
                const trace = {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack'
                };
                error = new _common.UnauthorizedException(error.message);
                this.logger.error(error.message, trace);
                throw error;
            } else {
                error = new _common.UnauthorizedException();
                var _error_stack1;
                this.logger.error(error.message, {
                    trace: (_error_stack1 = error.stack) !== null && _error_stack1 !== void 0 ? _error_stack1 : 'No stack'
                });
                throw error;
            }
        }
    }
    extractRefreshTokenFromCookie(request) {
        const token = request.cookies['refreshToken'];
        if (!token) {
            const error = new _common.UnauthorizedException('쿠키에 refreshToken이 없습니다');
            var _error_stack;
            this.logger.error(`쿠키에 refreshToken이 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
        return token;
    }
    constructor(authService, logger){
        this.authService = authService;
        this.logger = logger;
    }
};
RefreshTokenGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], RefreshTokenGuard);

//# sourceMappingURL=refresh-token.guard.js.map