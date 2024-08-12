"use strict";
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _jwt = require("@nestjs/jwt");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _authguard = require("./guards/auth.guard");
const _oauthmodule = require("./oauth/oauth.module");
const _tokenservice = require("./token/token.service");
const _dogsmodule = require("../dogs/dogs.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _jwt.JwtModule.registerAsync({
                inject: [
                    _config.ConfigService
                ],
                useFactory: async (config)=>({
                        secret: config.get('JWT_SECRET')
                    })
            }),
            _dogsmodule.DogsModule,
            _oauthmodule.OauthModule
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _tokenservice.TokenService,
            {
                provide: _core.APP_GUARD,
                useClass: _authguard.AuthGuard
            }
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map