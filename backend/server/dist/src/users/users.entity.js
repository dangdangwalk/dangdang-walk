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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const role_type_1 = require("./types/role.type");
const dogs_entity_1 = require("../dogs/dogs.entity");
let Users = class Users {
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Users.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_image_url' }),
    __metadata("design:type", String)
], Users.prototype, "profileImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: role_type_1.ROLE,
        default: role_type_1.ROLE.User,
    }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dogs_entity_1.Dogs),
    (0, typeorm_1.JoinColumn)({ name: 'main_dog_id' }),
    __metadata("design:type", dogs_entity_1.Dogs)
], Users.prototype, "mainDog", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'main_dog_id', nullable: true }),
    __metadata("design:type", Object)
], Users.prototype, "mainDogId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_id', unique: true }),
    __metadata("design:type", String)
], Users.prototype, "oauthId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_access_token' }),
    __metadata("design:type", String)
], Users.prototype, "oauthAccessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_refresh_token' }),
    __metadata("design:type", String)
], Users.prototype, "oauthRefreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token' }),
    __metadata("design:type", String)
], Users.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Users);
//# sourceMappingURL=users.entity.js.map