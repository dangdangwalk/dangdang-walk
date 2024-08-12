"use strict";
Object.defineProperty(exports, "OauthModule", {
    enumerable: true,
    get: function() {
        return OauthModule;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _googleservice = require("./google.service");
const _kakaoservice = require("./kakao.service");
const _naverservice = require("./naver.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OauthModule = class OauthModule {
};
OauthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _axios.HttpModule
        ],
        providers: [
            _googleservice.GoogleService,
            _kakaoservice.KakaoService,
            _naverservice.NaverService
        ],
        exports: [
            _googleservice.GoogleService,
            _kakaoservice.KakaoService,
            _naverservice.NaverService
        ]
    })
], OauthModule);

//# sourceMappingURL=oauth.module.js.map