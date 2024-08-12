"use strict";
Object.defineProperty(exports, "S3Module", {
    enumerable: true,
    get: function() {
        return S3Module;
    }
});
const _common = require("@nestjs/common");
const _s3controller = require("./s3.controller");
const _s3service = require("./s3.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let S3Module = class S3Module {
};
S3Module = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _s3controller.S3Controller
        ],
        providers: [
            _s3service.S3Service
        ],
        exports: [
            _s3service.S3Service
        ]
    })
], S3Module);

//# sourceMappingURL=s3.module.js.map