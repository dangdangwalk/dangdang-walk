"use strict";
Object.defineProperty(exports, "PeriodValidationPipe", {
    enumerable: true,
    get: function() {
        return PeriodValidationPipe;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PeriodValidationPipe = class PeriodValidationPipe {
    transform(value) {
        if (!value) {
            throw new _common.BadRequestException('period query parameter is missing.');
        }
        if (!this.allowedPeriods.includes(value)) {
            throw new _common.BadRequestException(`Invalid period: ${value}. Allowed periods are: ${this.allowedPeriods.join(', ')}`);
        }
        return value;
    }
    constructor(allowedPeriods){
        this.allowedPeriods = allowedPeriods;
    }
};
PeriodValidationPipe = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ])
], PeriodValidationPipe);

//# sourceMappingURL=period-validation.pipe.js.map