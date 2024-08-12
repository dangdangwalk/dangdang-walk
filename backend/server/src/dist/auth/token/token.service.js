"use strict";
Object.defineProperty(exports, "TokenService", {
    enumerable: true,
    get: function() {
        return TokenService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _msutil = require("../../utils/ms.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TokenService = class TokenService {
    async signAccessToken(userId, provider) {
        const payload = {
            userId,
            provider
        };
        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService.TOKEN_LIFETIME_MAP.access.expiresIn
        });
        return newToken;
    }
    async signRefreshToken(oauthId, provider) {
        const payload = {
            oauthId,
            provider
        };
        const newToken = await this.jwtService.signAsync(payload, {
            expiresIn: TokenService.TOKEN_LIFETIME_MAP.refresh.expiresIn
        });
        return newToken;
    }
    async verify(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false
        });
        if ('userId' in payload) {
            payload.userId = parseInt(payload.userId);
        }
        return payload;
    }
    constructor(jwtService, configService){
        this.jwtService = jwtService;
        this.configService = configService;
        const ACCESS_TOKEN_LIFETIME = this.configService.get('ACCESS_TOKEN_LIFETIME', '1h');
        const REFRESH_TOKEN_LIFETIME = this.configService.get('REFRESH_TOKEN_LIFETIME', '14d');
        TokenService.TOKEN_LIFETIME_MAP = {
            access: {
                expiresIn: ACCESS_TOKEN_LIFETIME,
                maxAge: (0, _msutil.parse)(ACCESS_TOKEN_LIFETIME)
            },
            refresh: {
                expiresIn: REFRESH_TOKEN_LIFETIME,
                maxAge: (0, _msutil.parse)(REFRESH_TOKEN_LIFETIME)
            }
        };
    }
};
TokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], TokenService);

//# sourceMappingURL=token.service.js.map