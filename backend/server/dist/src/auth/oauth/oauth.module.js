"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const google_service_1 = require("./google.service");
const kakao_service_1 = require("./kakao.service");
const naver_service_1 = require("./naver.service");
let OauthModule = class OauthModule {
};
exports.OauthModule = OauthModule;
exports.OauthModule = OauthModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [google_service_1.GoogleService, kakao_service_1.KakaoService, naver_service_1.NaverService],
        exports: [google_service_1.GoogleService, kakao_service_1.KakaoService, naver_service_1.NaverService],
    })
], OauthModule);
//# sourceMappingURL=oauth.module.js.map