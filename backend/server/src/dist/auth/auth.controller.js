"use strict";
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _oauthdatadecorator = require("./decorators/oauth-data.decorator");
const _publicdecorator = require("./decorators/public.decorator");
const _oauthauthorizedto = require("./dtos/oauth-authorize.dto");
const _oauthdto = require("./dtos/oauth.dto");
const _oauthdataguard = require("./guards/oauth-data.guard");
const _refreshtokenguard = require("./guards/refresh-token.guard");
const _cookieinterceptor = require("./interceptors/cookie.interceptor");
const _tokenservice = require("./token/token.service");
const _userdecorator = require("../users/decorators/user.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuthController = class AuthController {
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
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('/login'),
    (0, _common.HttpCode)(200),
    (0, _publicdecorator.SkipAuthGuard)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauthauthorizedto.OauthAuthorizeDto === "undefined" ? Object : _oauthauthorizedto.OauthAuthorizeDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Post)('/signup'),
    (0, _publicdecorator.SkipAuthGuard)(),
    (0, _common.UseGuards)(_oauthdataguard.OauthDataGuard),
    _ts_param(0, (0, _oauthdatadecorator.OauthCookies)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauthdto.OauthDto === "undefined" ? Object : _oauthdto.OauthDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
_ts_decorate([
    (0, _common.Post)('/logout'),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _common.Get)('/token'),
    (0, _publicdecorator.SkipAuthGuard)(),
    (0, _common.UseGuards)(_refreshtokenguard.RefreshTokenGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.RefreshTokenPayload === "undefined" ? Object : _tokenservice.RefreshTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "token", null);
_ts_decorate([
    (0, _common.Delete)('/deactivate'),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "deactivate", null);
AuthController = _ts_decorate([
    (0, _common.Controller)('/auth'),
    (0, _common.UseInterceptors)(_cookieinterceptor.CookieInterceptor),
    (0, _common.UsePipes)(new _common.ValidationPipe({
        validateCustomDecorators: true,
        whitelist: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map