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
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const ms_util_1 = require("../../utils/ms.util");
let TokenService = TokenService_1 = class TokenService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        const ACCESS_TOKEN_LIFETIME = this.configService.get('ACCESS_TOKEN_LIFETIME', '1h');
        const REFRESH_TOKEN_LIFETIME = this.configService.get('REFRESH_TOKEN_LIFETIME', '14d');
        TokenService_1.TOKEN_LIFETIME_MAP = {
            access: { expiresIn: ACCESS_TOKEN_LIFETIME, maxAge: (0, ms_util_1.parse)(ACCESS_TOKEN_LIFETIME) },
            refresh: { expiresIn: REFRESH_TOKEN_LIFETIME, maxAge: (0, ms_util_1.parse)(REFRESH_TOKEN_LIFETIME) },
        };
    }
    async signAccessToken(userId, provider) {
        const payload = {
            userId,
            provider,
        };
        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService_1.TOKEN_LIFETIME_MAP.access.expiresIn,
        });
        return newToken;
    }
    async signRefreshToken(oauthId, provider) {
        const payload = {
            oauthId,
            provider,
        };
        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService_1.TOKEN_LIFETIME_MAP.refresh.expiresIn,
        });
        return newToken;
    }
    async verify(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false,
        });
        if ('userId' in payload) {
            payload.userId = parseInt(payload.userId);
        }
        return payload;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], TokenService);
//# sourceMappingURL=token.service.js.map