"use strict";
Object.defineProperty(exports, "Dogs", {
    enumerable: true,
    get: function() {
        return Dogs;
    }
});
const _typeorm = require("typeorm");
const _dogstype = require("./types/dogs.type");
const _breedentity = require("../breed/breed.entity");
const _dogwalkdayentity = require("../dog-walk-day/dog-walk-day.entity");
const _todaywalktimeentity = require("../today-walk-time/today-walk-time.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Dogs = class Dogs {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Dogs.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_dogwalkdayentity.DogWalkDay, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'walk_day_id'
    }),
    _ts_metadata("design:type", typeof _dogwalkdayentity.DogWalkDay === "undefined" ? Object : _dogwalkdayentity.DogWalkDay)
], Dogs.prototype, "walkDay", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'walk_day_id'
    }),
    _ts_metadata("design:type", Number)
], Dogs.prototype, "walkDayId", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_todaywalktimeentity.TodayWalkTime, {
        nullable: false,
        cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'today_walk_time_id'
    }),
    _ts_metadata("design:type", typeof _todaywalktimeentity.TodayWalkTime === "undefined" ? Object : _todaywalktimeentity.TodayWalkTime)
], Dogs.prototype, "todayWalkTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'today_walk_time_id'
    }),
    _ts_metadata("design:type", Number)
], Dogs.prototype, "todayWalkTimeId", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], Dogs.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_breedentity.Breed, {
        nullable: false,
        eager: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'breed_id'
    }),
    _ts_metadata("design:type", typeof _breedentity.Breed === "undefined" ? Object : _breedentity.Breed)
], Dogs.prototype, "breed", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'breed_id'
    }),
    _ts_metadata("design:type", Number)
], Dogs.prototype, "breedId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _dogstype.GENDER
    }),
    _ts_metadata("design:type", typeof _dogstype.Gender === "undefined" ? Object : _dogstype.Gender)
], Dogs.prototype, "gender", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'date',
        default: null
    }),
    _ts_metadata("design:type", Object)
], Dogs.prototype, "birth", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_neutered'
    }),
    _ts_metadata("design:type", Boolean)
], Dogs.prototype, "isNeutered", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'weight'
    }),
    _ts_metadata("design:type", Number)
], Dogs.prototype, "weight", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'profile_photo_url',
        type: 'varchar',
        nullable: true,
        default: null
    }),
    _ts_metadata("design:type", Object)
], Dogs.prototype, "profilePhotoUrl", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_walking',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Dogs.prototype, "isWalking", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Dogs.prototype, "updatedAt", void 0);
Dogs = _ts_decorate([
    (0, _typeorm.Entity)('dogs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], Dogs);

//# sourceMappingURL=dogs.entity.js.map