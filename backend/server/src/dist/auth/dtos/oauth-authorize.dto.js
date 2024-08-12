"use strict";
Object.defineProperty(exports, "OauthAuthorizeDto", {
    enumerable: true,
    get: function() {
        return OauthAuthorizeDto;
    }
});
const _classvalidator = require("class-validator");
const _oauthprovidertype = require("../types/oauth-provider.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OauthAuthorizeDto = class OauthAuthorizeDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], OauthAuthorizeDto.prototype, "authorizeCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)(_oauthprovidertype.OAUTH_PROVIDERS),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _oauthprovidertype.OauthProvider === "undefined" ? Object : _oauthprovidertype.OauthProvider)
], OauthAuthorizeDto.prototype, "provider", void 0);

//# sourceMappingURL=oauth-authorize.dto.js.map