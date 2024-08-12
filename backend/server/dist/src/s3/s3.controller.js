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
exports.S3Controller = void 0;
const common_1 = require("@nestjs/common");
const file_type_validation_pipe_1 = require("./pipes/file-type-validation.pipe");
const s3_service_1 = require("./s3.service");
const user_decorator_1 = require("../users/decorators/user.decorator");
let S3Controller = class S3Controller {
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async presignedUrl(user, type) {
        return await this.s3Service.createPresignedUrlWithClientForPut(user.userId, type);
    }
    async delete({ userId }, filenames) {
        await this.s3Service.deleteObjects(userId, filenames);
    }
};
exports.S3Controller = S3Controller;
__decorate([
    (0, common_1.Post)('/presigned-url'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)(new file_type_validation_pipe_1.FileTypeValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "presignedUrl", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(204),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: String, separator: ',' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "delete", null);
exports.S3Controller = S3Controller = __decorate([
    (0, common_1.Controller)('/images'),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
//# sourceMappingURL=s3.controller.js.map