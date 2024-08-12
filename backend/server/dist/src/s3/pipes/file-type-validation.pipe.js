"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const validator_util_1 = require("../../utils/validator.util");
const allowedFileTypes = [
    'xbm',
    'tif',
    'jfif',
    'ico',
    'tiff',
    'gif',
    'svg',
    'webp',
    'svgz',
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'pjp',
    'apng',
    'pjpeg',
    'avif',
];
let FileTypeValidationPipe = class FileTypeValidationPipe {
    constructor() {
        this.allowedExtensions = allowedFileTypes;
    }
    transform(value) {
        if (!(0, validator_util_1.isTypedArray)(value, 'string')) {
            throw new common_1.BadRequestException('Validation failed (string array expected)');
        }
        const invalidFiles = value.filter((type) => !this.allowedExtensions.includes(type.toLowerCase()));
        if (invalidFiles.length > 0) {
            throw new common_1.BadRequestException(`Invalid file types: ${invalidFiles.join(', ')}. Allowed types are: ${this.allowedExtensions.join(', ')}`);
        }
        return value;
    }
};
exports.FileTypeValidationPipe = FileTypeValidationPipe;
exports.FileTypeValidationPipe = FileTypeValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileTypeValidationPipe);
//# sourceMappingURL=file-type-validation.pipe.js.map