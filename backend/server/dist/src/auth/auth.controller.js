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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const oauth_data_decorator_1 = require("./decorators/oauth-data.decorator");
const public_decorator_1 = require("./decorators/public.decorator");
const oauth_authorize_dto_1 = require("./dtos/oauth-authorize.dto");
const oauth_dto_1 = require("./dtos/oauth.dto");
const oauth_data_guard_1 = require("./guards/oauth-data.guard");
const refresh_token_guard_1 = require("./guards/refresh-token.guard");
const cookie_interceptor_1 = require("./interceptors/cookie.interceptor");
const user_decorator_1 = require("../users/decorators/user.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(oauthAuthorizeDTO) {
        return await this.authService.login(oauthAuthorizeDTO);
    }
    async signup(oauthDTO) {
        return await this.authService.signup(oauthDTO);
    }
    async logout(user) {
        return await this.authService.logout(user);
    }
    async token(user) {
        return await this.authService.reissueTokens(user);
    }
    async deactivate(user) {
        return await this.authService.deactivate(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(200),
    (0, public_decorator_1.SkipAuthGuard)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_authorize_dto_1.OauthAuthorizeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/signup'),
    (0, public_decorator_1.SkipAuthGuard)(),
    (0, common_1.UseGuards)(oauth_data_guard_1.OauthDataGuard),
    __param(0, (0, oauth_data_decorator_1.OauthCookies)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.OauthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('/token'),
    (0, public_decorator_1.SkipAuthGuard)(),
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "token", null);
__decorate([
    (0, common_1.Delete)('/deactivate'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deactivate", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    (0, common_1.UseInterceptors)(cookie_interceptor_1.CookieInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ validateCustomDecorators: true, whitelist: true })),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map