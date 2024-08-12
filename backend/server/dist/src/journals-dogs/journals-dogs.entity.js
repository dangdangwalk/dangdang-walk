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
exports.JournalsDogs = void 0;
const typeorm_1 = require("typeorm");
const dogs_entity_1 = require("../dogs/dogs.entity");
const journals_entity_1 = require("../journals/journals.entity");
let JournalsDogs = class JournalsDogs {
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.JournalsDogs = JournalsDogs;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'journal_id' }),
    (0, typeorm_1.ManyToOne)(() => journals_entity_1.Journals, (walkJournals) => walkJournals.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'journal_id' }),
    __metadata("design:type", Number)
], JournalsDogs.prototype, "journalId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'dog_id' }),
    (0, typeorm_1.ManyToOne)(() => dogs_entity_1.Dogs, (dog) => dog.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'dog_id' }),
    __metadata("design:type", Number)
], JournalsDogs.prototype, "dogId", void 0);
exports.JournalsDogs = JournalsDogs = __decorate([
    (0, typeorm_1.Entity)('journals_dogs'),
    __metadata("design:paramtypes", [JournalsDogs])
], JournalsDogs);
//# sourceMappingURL=journals-dogs.entity.js.map