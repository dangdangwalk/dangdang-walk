"use strict";
Object.defineProperty(exports, "FileTypeValidationPipe", {
    enumerable: true,
    get: function() {
        return FileTypeValidationPipe;
    }
});
const _common = require("@nestjs/common");
const _validatorutil = require("../../utils/validator.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
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
    'avif'
];
let FileTypeValidationPipe = class FileTypeValidationPipe {
    transform(value) {
        if (!(0, _validatorutil.isTypedArray)(value, 'string')) {
            throw new _common.BadRequestException('Validation failed (string array expected)');
        }
        const invalidFiles = value.filter((type)=>!this.allowedExtensions.includes(type.toLowerCase()));
        if (invalidFiles.length > 0) {
            throw new _common.BadRequestException(`Invalid file types: ${invalidFiles.join(', ')}. Allowed types are: ${this.allowedExtensions.join(', ')}`);
        }
        return value;
    }
    constructor(){
        this.allowedExtensions = allowedFileTypes;
    }
};
FileTypeValidationPipe = _ts_decorate([
    (0, _common.Injectable)()
], FileTypeValidationPipe);

//# sourceMappingURL=file-type-validation.pipe.js.map