"use strict";
Object.defineProperty(exports, "CreateJournalDto", {
    enumerable: true,
    get: function() {
        return CreateJournalDto;
    }
});
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _WGS84validator = require("../validators/WGS84.validator");
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
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], Excrements.prototype, "dogId", void 0);
_ts_decorate([
    (0, _WGS84validator.IsWGS84)(),
    _ts_metadata("design:type", Array)
], Excrements.prototype, "fecesLocations", void 0);
_ts_decorate([
    (0, _WGS84validator.IsWGS84)(),
    _ts_metadata("design:type", Array)
], Excrements.prototype, "urineLocations", void 0);
let JournalInfo = class JournalInfo {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Max)(100000) //TODO: 합의 필요
    ,
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], JournalInfo.prototype, "distance", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Max)(10800) //TODO: 합의 필요
    ,
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], JournalInfo.prototype, "calories", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], JournalInfo.prototype, "startedAt", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Max)(10800) //TODO: 합의 필요
    ,
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], JournalInfo.prototype, "duration", void 0);
_ts_decorate([
    (0, _WGS84validator.IsWGS84)(),
    _ts_metadata("design:type", Array)
], JournalInfo.prototype, "routes", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], JournalInfo.prototype, "memo", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], JournalInfo.prototype, "journalPhotos", void 0);
let CreateJournalDto = class CreateJournalDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsNumber)({}, {
        each: true
    }),
    _ts_metadata("design:type", Array)
], CreateJournalDto.prototype, "dogs", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>JournalInfo),
    _ts_metadata("design:type", typeof JournalInfo === "undefined" ? Object : JournalInfo)
], CreateJournalDto.prototype, "journalInfo", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>Excrements),
    _ts_metadata("design:type", Array)
], CreateJournalDto.prototype, "excrements", void 0);

//# sourceMappingURL=create-journal.dto.js.map