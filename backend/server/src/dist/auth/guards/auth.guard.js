"use strict";
Object.defineProperty(exports, "AuthGuard", {
    enumerable: true,
    get: function() {
        return AuthGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _jwt = require("@nestjs/jwt");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _authservice = require("../auth.service");
const _publicdecorator = require("../decorators/public.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthGuard = class AuthGuard {
    async canActivate(context) {
        if (this.shouldSkipAuthGuard(context)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractAccessTokenFromHeader(request);
        try {
            request.user = await this.authService.validateAccessToken(token);
            return true;
        } catch (error) {
            if (error instanceof _jwt.TokenExpiredError || error instanceof _jwt.JsonWebTokenError) {
                error = new _common.UnauthorizedException(error.message);
                var _error_stack;
                this.logger.error(error.message, {
                    trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack'
                });
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
    shouldSkipAuthGuard(context) {
        const request = context.switchToHttp().getRequest();
        const skipAuthGuard = this.reflector.getAllAndOverride(_publicdecorator.SKIP, [
            context.getHandler(),
            context.getClass()
        ]);
        return skipAuthGuard || request.url === '/metrics';
    }
    extractAccessTokenFromHeader(request) {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            const error = new _common.UnauthorizedException('헤더에 Authorization 필드가 없습니다');
            var _error_stack;
            this.logger.error(`헤더에 Authorization 필드가 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : 'No stack'
            });
            throw error;
        }
        const [type, token] = authorizationHeader.split(' ');
        if (!token || type !== 'Bearer') {
            const error = new _common.UnauthorizedException('Token does not exist in Authorization header or is in an invalid format.');
            var _error_stack1;
            this.logger.error(`헤더의 Authorization 필드에 토큰이 없거나, 형식이 잘못되었습니다`, {
                trace: (_error_stack1 = error.stack) !== null && _error_stack1 !== void 0 ? _error_stack1 : 'No stack'
            });
            throw error;
        }
        return token;
    }
    constructor(authService, reflector, logger){
        this.authService = authService;
        this.reflector = reflector;
        this.logger = logger;
    }
};
AuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], AuthGuard);

//# sourceMappingURL=auth.guard.js.map