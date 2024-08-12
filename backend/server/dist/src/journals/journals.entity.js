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
exports.Journals = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
let Journals = class Journals {
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.Journals = Journals;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Journals.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (users) => users.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.Users)
], Journals.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Journals.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Journals.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Journals.prototype, "calories", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at' }),
    __metadata("design:type", Date)
], Journals.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Journals.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_photos' }),
    __metadata("design:type", String)
], Journals.prototype, "journalPhotos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Journals.prototype, "routes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Journals.prototype, "memo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'excrement_count' }),
    __metadata("design:type", String)
], Journals.prototype, "excrementCount", void 0);
exports.Journals = Journals = __decorate([
    (0, typeorm_1.Entity)('journals'),
    (0, typeorm_1.Index)(['userId', 'startedAt']),
    __metadata("design:paramtypes", [Object])
], Journals);
//# sourceMappingURL=journals.entity.js.map