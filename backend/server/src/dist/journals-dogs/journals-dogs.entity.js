"use strict";
Object.defineProperty(exports, "JournalsDogs", {
    enumerable: true,
    get: function() {
        return JournalsDogs;
    }
});
const _typeorm = require("typeorm");
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
let JournalsDogs = class JournalsDogs {
    constructor(entityData){
        Object.assign(this, entityData);
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'journal_id'
    }),
    (0, _typeorm.ManyToOne)(()=>_journalsentity.Journals, (walkJournals)=>walkJournals.id, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'journal_id'
    }),
    _ts_metadata("design:type", Number)
], JournalsDogs.prototype, "journalId", void 0);
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
], JournalsDogs.prototype, "dogId", void 0);
JournalsDogs = _ts_decorate([
    (0, _typeorm.Entity)('journals_dogs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ])
], JournalsDogs);

//# sourceMappingURL=journals-dogs.entity.js.map