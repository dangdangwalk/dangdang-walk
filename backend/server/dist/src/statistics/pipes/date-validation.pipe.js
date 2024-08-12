"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let DateValidationPipe = class DateValidationPipe {
    transform(value) {
        if (!value) {
            throw new common_1.BadRequestException('date query parameter is missing.');
        }
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!value.match(dateFormat)) {
            throw new common_1.BadRequestException('Invalid date format. Please provide date in YYYY-MM-DD format.');
        }
        const [year, month, day] = value.split('-').map(Number);
        if (month < 1 || month > 12) {
            throw new common_1.BadRequestException(`Invalid month: ${month}. Month must be between 1 and 12.`);
        }
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > lastDayOfMonth) {
            throw new common_1.BadRequestException(`Invalid day: ${day}. Day must be between 1 and ${lastDayOfMonth}.`);
        }
        return value;
    }
};
exports.DateValidationPipe = DateValidationPipe;
exports.DateValidationPipe = DateValidationPipe = __decorate([
    (0, common_1.Injectable)()
], DateValidationPipe);
//# sourceMappingURL=date-validation.pipe.js.map