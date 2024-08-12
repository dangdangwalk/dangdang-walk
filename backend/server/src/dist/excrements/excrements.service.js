"use strict";
Object.defineProperty(exports, "ExcrementsService", {
    enumerable: true,
    get: function() {
        return ExcrementsService;
    }
});
const _common = require("@nestjs/common");
const _excrementsrepository = require("./excrements.repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ExcrementsService = class ExcrementsService {
    async insert(entity) {
        return await this.excrementsRepository.insert(entity);
    }
    makeCoordinate(lat, lng) {
        return `POINT(${lat.toString()} ${lng.toString()})`;
    }
    constructor(excrementsRepository){
        this.excrementsRepository = excrementsRepository;
    }
};
ExcrementsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _excrementsrepository.ExcrementsRepository === "undefined" ? Object : _excrementsrepository.ExcrementsRepository
    ])
], ExcrementsService);

//# sourceMappingURL=excrements.service.js.map