"use strict";
Object.defineProperty(exports, "S3Controller", {
    enumerable: true,
    get: function() {
        return S3Controller;
    }
});
const _common = require("@nestjs/common");
const _filetypevalidationpipe = require("./pipes/file-type-validation.pipe");
const _s3service = require("./s3.service");
const _tokenservice = require("../auth/token/token.service");
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
let S3Controller = class S3Controller {
    async presignedUrl(user, type) {
        return await this.s3Service.createPresignedUrlWithClientForPut(user.userId, type);
    }
    async delete({ userId }, filenames) {
        await this.s3Service.deleteObjects(userId, filenames);
    }
    constructor(s3Service){
        this.s3Service = s3Service;
    }
};
_ts_decorate([
    (0, _common.Post)('/presigned-url'),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Body)(new _filetypevalidationpipe.FileTypeValidationPipe())),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], S3Controller.prototype, "presignedUrl", null);
_ts_decorate([
    (0, _common.Delete)(),
    (0, _common.HttpCode)(204),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Body)(new _common.ParseArrayPipe({
        items: String,
        separator: ','
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], S3Controller.prototype, "delete", null);
S3Controller = _ts_decorate([
    (0, _common.Controller)('/images'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _s3service.S3Service === "undefined" ? Object : _s3service.S3Service
    ])
], S3Controller);

//# sourceMappingURL=s3.controller.js.map