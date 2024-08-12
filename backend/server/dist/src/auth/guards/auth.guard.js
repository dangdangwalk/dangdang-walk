"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const auth_service_1 = require("../auth.service");
const public_decorator_1 = require("../decorators/public.decorator");
let AuthGuard = class AuthGuard {
    constructor(authService, reflector, logger) {
        this.authService = authService;
        this.reflector = reflector;
        this.logger = logger;
    }
    async canActivate(context) {
        if (this.shouldSkipAuthGuard(context)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractAccessTokenFromHeader(request);
        try {
            request.user = await this.authService.validateAccessToken(token);
            return true;
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError || error instanceof jwt_1.JsonWebTokenError) {
                error = new common_1.UnauthorizedException(error.message);
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            }
            else {
                error = new common_1.UnauthorizedException();
                this.logger.error(error.message, { trace: error.stack ?? 'No stack' });
                throw error;
            }
        }
    }
    shouldSkipAuthGuard(context) {
        const request = context.switchToHttp().getRequest();
        const skipAuthGuard = this.reflector.getAllAndOverride(public_decorator_1.SKIP, [
            context.getHandler(),
            context.getClass(),
        ]);
        return skipAuthGuard || request.url === '/metrics';
    }
    extractAccessTokenFromHeader(request) {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            const error = new common_1.UnauthorizedException('헤더에 Authorization 필드가 없습니다');
            this.logger.error(`헤더에 Authorization 필드가 없습니다`, { trace: error.stack ?? 'No stack' });
            throw error;
        }
        const [type, token] = authorizationHeader.split(' ');
        if (!token || type !== 'Bearer') {
            const error = new common_1.UnauthorizedException('Token does not exist in Authorization header or is in an invalid format.');
            this.logger.error(`헤더의 Authorization 필드에 토큰이 없거나, 형식이 잘못되었습니다`, {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }
        return token;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector,
        winstonLogger_service_1.WinstonLoggerService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map