"use strict";
Object.defineProperty(exports, "TodayWalkTime", {
    enumerable: true,
    get: function() {
        return TodayWalkTime;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TodayWalkTime = class TodayWalkTime {
    setUpdatedAtBeforeUpdate() {
        this.updatedAt = new Date();
    }
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], TodayWalkTime.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], TodayWalkTime.prototype, "duration", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TodayWalkTime.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.BeforeUpdate)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], TodayWalkTime.prototype, "setUpdatedAtBeforeUpdate", null);
TodayWalkTime = _ts_decorate([
    (0, _typeorm.Entity)('today_walk_time'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], TodayWalkTime);

//# sourceMappingURL=today-walk-time.entity.js.map