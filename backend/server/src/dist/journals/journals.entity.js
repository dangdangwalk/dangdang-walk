"use strict";
Object.defineProperty(exports, "Journals", {
    enumerable: true,
    get: function() {
        return Journals;
    }
});
const _typeorm = require("typeorm");
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
let Journals = class Journals {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Journals.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_usersentity.Users, (users)=>users.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", typeof _usersentity.Users === "undefined" ? Object : _usersentity.Users)
], Journals.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", Number)
], Journals.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", Number)
], Journals.prototype, "distance", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", Number)
], Journals.prototype, "calories", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'started_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Journals.prototype, "startedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", Number)
], Journals.prototype, "duration", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'journal_photos'
    }),
    _ts_metadata("design:type", String)
], Journals.prototype, "journalPhotos", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], Journals.prototype, "routes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Journals.prototype, "memo", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'excrement_count'
    }),
    _ts_metadata("design:type", String)
], Journals.prototype, "excrementCount", void 0);
Journals = _ts_decorate([
    (0, _typeorm.Entity)('journals'),
    (0, _typeorm.Index)([
        'userId',
        'startedAt'
    ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], Journals);

//# sourceMappingURL=journals.entity.js.map