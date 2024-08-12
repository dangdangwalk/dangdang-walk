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
exports.TodayWalkTime = void 0;
const typeorm_1 = require("typeorm");
let TodayWalkTime = class TodayWalkTime {
    setUpdatedAtBeforeUpdate() {
        this.updatedAt = new Date();
    }
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.TodayWalkTime = TodayWalkTime;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TodayWalkTime.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TodayWalkTime.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TodayWalkTime.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodayWalkTime.prototype, "setUpdatedAtBeforeUpdate", null);
exports.TodayWalkTime = TodayWalkTime = __decorate([
    (0, typeorm_1.Entity)('today_walk_time'),
    __metadata("design:paramtypes", [Object])
], TodayWalkTime);
//# sourceMappingURL=today-walk-time.entity.js.map