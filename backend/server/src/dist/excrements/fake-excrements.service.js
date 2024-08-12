"use strict";
Object.defineProperty(exports, "FakeExcrementsService", {
    enumerable: true,
    get: function() {
        return FakeExcrementsService;
    }
});
const _common = require("@nestjs/common");
const _excrementsentity = require("./excrements.entity");
const _excrementsrepository = require("./excrements.repository");
const _excrementsservice = require("./excrements.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FakeExcrementsService = class FakeExcrementsService extends _excrementsservice.ExcrementsService {
    async createIfNotExists(data) {
        const excrement = [];
        const expectedExcrement = new _excrementsentity.Excrements({
            id: excrement.length + 1,
            journalId: data.journalId,
            dogId: data.dogId,
            type: data.type,
            coordinate: data.coordinate
        });
        excrement.push(expectedExcrement);
        return Promise.resolve(expectedExcrement);
    }
    makeCoordinate(lat, lng) {
        return `POINT(${lat} ${lng})`;
    }
    constructor(excrementsRepository){
        super(excrementsRepository);
    }
};
FakeExcrementsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _excrementsrepository.ExcrementsRepository === "undefined" ? Object : _excrementsrepository.ExcrementsRepository
    ])
], FakeExcrementsService);

//# sourceMappingURL=fake-excrements.service.js.map