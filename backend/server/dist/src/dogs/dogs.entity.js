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
exports.Dogs = void 0;
const typeorm_1 = require("typeorm");
const dogs_type_1 = require("./types/dogs.type");
const breed_entity_1 = require("../breed/breed.entity");
const dog_walk_day_entity_1 = require("../dog-walk-day/dog-walk-day.entity");
const today_walk_time_entity_1 = require("../today-walk-time/today-walk-time.entity");
let Dogs = class Dogs {
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.Dogs = Dogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Dogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => dog_walk_day_entity_1.DogWalkDay, { nullable: false, cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'walk_day_id' }),
    __metadata("design:type", dog_walk_day_entity_1.DogWalkDay)
], Dogs.prototype, "walkDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'walk_day_id' }),
    __metadata("design:type", Number)
], Dogs.prototype, "walkDayId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => today_walk_time_entity_1.TodayWalkTime, { nullable: false, cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'today_walk_time_id' }),
    __metadata("design:type", today_walk_time_entity_1.TodayWalkTime)
], Dogs.prototype, "todayWalkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'today_walk_time_id' }),
    __metadata("design:type", Number)
], Dogs.prototype, "todayWalkTimeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dogs.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => breed_entity_1.Breed, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'breed_id' }),
    __metadata("design:type", breed_entity_1.Breed)
], Dogs.prototype, "breed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'breed_id' }),
    __metadata("design:type", Number)
], Dogs.prototype, "breedId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: dogs_type_1.GENDER,
    }),
    __metadata("design:type", String)
], Dogs.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'date', default: null }),
    __metadata("design:type", Object)
], Dogs.prototype, "birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_neutered' }),
    __metadata("design:type", Boolean)
], Dogs.prototype, "isNeutered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight' }),
    __metadata("design:type", Number)
], Dogs.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_photo_url', type: 'varchar', nullable: true, default: null }),
    __metadata("design:type", Object)
], Dogs.prototype, "profilePhotoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_walking', default: false }),
    __metadata("design:type", Boolean)
], Dogs.prototype, "isWalking", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Dogs.prototype, "updatedAt", void 0);
exports.Dogs = Dogs = __decorate([
    (0, typeorm_1.Entity)('dogs'),
    __metadata("design:paramtypes", [Object])
], Dogs);
//# sourceMappingURL=dogs.entity.js.map