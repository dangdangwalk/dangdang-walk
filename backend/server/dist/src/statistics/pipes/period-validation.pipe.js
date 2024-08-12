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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let PeriodValidationPipe = class PeriodValidationPipe {
    constructor(allowedPeriods) {
        this.allowedPeriods = allowedPeriods;
    }
    transform(value) {
        if (!value) {
            throw new common_1.BadRequestException('period query parameter is missing.');
        }
        if (!this.allowedPeriods.includes(value)) {
            throw new common_1.BadRequestException(`Invalid period: ${value}. Allowed periods are: ${this.allowedPeriods.join(', ')}`);
        }
        return value;
    }
};
exports.PeriodValidationPipe = PeriodValidationPipe;
exports.PeriodValidationPipe = PeriodValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], PeriodValidationPipe);
//# sourceMappingURL=period-validation.pipe.js.map