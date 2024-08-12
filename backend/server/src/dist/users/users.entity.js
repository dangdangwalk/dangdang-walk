"use strict";
Object.defineProperty(exports, "Users", {
    enumerable: true,
    get: function() {
        return Users;
    }
});
const _typeorm = require("typeorm");
const _roletype = require("./types/role.type");
const _dogsentity = require("../dogs/dogs.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Users = class Users {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Users.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "nickname", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], Users.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'profile_image_url'
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "profileImageUrl", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: _roletype.ROLE,
        default: _roletype.ROLE.User
    }),
    _ts_metadata("design:type", typeof _roletype.Role === "undefined" ? Object : _roletype.Role)
], Users.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_dogsentity.Dogs),
    (0, _typeorm.JoinColumn)({
        name: 'main_dog_id'
    }),
    _ts_metadata("design:type", typeof _dogsentity.Dogs === "undefined" ? Object : _dogsentity.Dogs)
], Users.prototype, "mainDog", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'main_dog_id',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Users.prototype, "mainDogId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'oauth_id',
        unique: true
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "oauthId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'oauth_access_token'
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "oauthAccessToken", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'oauth_refresh_token'
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "oauthRefreshToken", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'refresh_token'
    }),
    _ts_metadata("design:type", String)
], Users.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Users.prototype, "createdAt", void 0);
Users = _ts_decorate([
    (0, _typeorm.Entity)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], Users);

//# sourceMappingURL=users.entity.js.map