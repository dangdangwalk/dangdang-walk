"use strict";
Object.defineProperty(exports, "UsersDogs", {
    enumerable: true,
    get: function() {
        return UsersDogs;
    }
});
const _typeorm = require("typeorm");
const _dogsentity = require("../dogs/dogs.entity");
const _usersentity = require("../users/users.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsersDogs = class UsersDogs {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'user_id'
    }),
    (0, _typeorm.ManyToOne)(()=>_usersentity.Users, (users)=>users.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", Number)
], UsersDogs.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'dog_id'
    }),
    (0, _typeorm.ManyToOne)(()=>_dogsentity.Dogs, (dog)=>dog.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'dog_id'
    }),
    _ts_metadata("design:type", Number)
], UsersDogs.prototype, "dogId", void 0);
UsersDogs = _ts_decorate([
    (0, _typeorm.Entity)('users_dogs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], UsersDogs);

//# sourceMappingURL=users-dogs.entity.js.map