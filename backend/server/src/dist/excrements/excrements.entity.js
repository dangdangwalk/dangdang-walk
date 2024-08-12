"use strict";
Object.defineProperty(exports, "Excrements", {
    enumerable: true,
    get: function() {
        return Excrements;
    }
});
const _typeorm = require("typeorm");
const _excrementtype = require("./types/excrement.type");
const _dogsentity = require("../dogs/dogs.entity");
const _journalsentity = require("../journals/journals.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Excrements = class Excrements {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Excrements.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_journalsentity.Journals, (WalkJournals)=>WalkJournals.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'journal_id'
    }),
    _ts_metadata("design:type", typeof _journalsentity.Journals === "undefined" ? Object : _journalsentity.Journals)
], Excrements.prototype, "journal", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'journal_id'
    }),
    _ts_metadata("design:type", Number)
], Excrements.prototype, "journalId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_dogsentity.Dogs, (dog)=>dog.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'dog_id'
    }),
    _ts_metadata("design:type", typeof _dogsentity.Dogs === "undefined" ? Object : _dogsentity.Dogs)
], Excrements.prototype, "dog", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'dog_id'
    }),
    _ts_metadata("design:type", Number)
], Excrements.prototype, "dogId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'type',
        type: 'enum',
        enum: _excrementtype.EXCREMENT
    }),
    _ts_metadata("design:type", typeof _excrementtype.Excrement === "undefined" ? Object : _excrementtype.Excrement)
], Excrements.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'point',
        spatialFeatureType: 'Point',
        srid: 4326
    }),
    _ts_metadata("design:type", String)
], Excrements.prototype, "coordinate", void 0);
Excrements = _ts_decorate([
    (0, _typeorm.Entity)('excrements'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ])
], Excrements);

//# sourceMappingURL=excrements.entity.js.map