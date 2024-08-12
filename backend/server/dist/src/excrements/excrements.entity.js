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
exports.Excrements = void 0;
const typeorm_1 = require("typeorm");
const excrement_type_1 = require("./types/excrement.type");
const dogs_entity_1 = require("../dogs/dogs.entity");
const journals_entity_1 = require("../journals/journals.entity");
let Excrements = class Excrements {
    constructor(entityData) {
        Object.assign(this, entityData);
    }
};
exports.Excrements = Excrements;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Excrements.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journals_entity_1.Journals, (WalkJournals) => WalkJournals.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'journal_id' }),
    __metadata("design:type", journals_entity_1.Journals)
], Excrements.prototype, "journal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_id' }),
    __metadata("design:type", Number)
], Excrements.prototype, "journalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dogs_entity_1.Dogs, (dog) => dog.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'dog_id' }),
    __metadata("design:type", dogs_entity_1.Dogs)
], Excrements.prototype, "dog", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dog_id' }),
    __metadata("design:type", Number)
], Excrements.prototype, "dogId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'enum', enum: excrement_type_1.EXCREMENT }),
    __metadata("design:type", String)
], Excrements.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'point', spatialFeatureType: 'Point', srid: 4326 }),
    __metadata("design:type", String)
], Excrements.prototype, "coordinate", void 0);
exports.Excrements = Excrements = __decorate([
    (0, typeorm_1.Entity)('excrements'),
    __metadata("design:paramtypes", [Object])
], Excrements);
//# sourceMappingURL=excrements.entity.js.map