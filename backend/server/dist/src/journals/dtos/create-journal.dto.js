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
exports.CreateJournalDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const WGS84_validator_1 = require("../validators/WGS84.validator");
class Excrements {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], Excrements.prototype, "dogId", void 0);
__decorate([
    (0, WGS84_validator_1.IsWGS84)(),
    __metadata("design:type", Array)
], Excrements.prototype, "fecesLocations", void 0);
__decorate([
    (0, WGS84_validator_1.IsWGS84)(),
    __metadata("design:type", Array)
], Excrements.prototype, "urineLocations", void 0);
class JournalInfo {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Max)(100000),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], JournalInfo.prototype, "distance", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Max)(10800),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], JournalInfo.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], JournalInfo.prototype, "startedAt", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(10800),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], JournalInfo.prototype, "duration", void 0);
__decorate([
    (0, WGS84_validator_1.IsWGS84)(),
    __metadata("design:type", Array)
], JournalInfo.prototype, "routes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JournalInfo.prototype, "memo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], JournalInfo.prototype, "journalPhotos", void 0);
class CreateJournalDto {
}
exports.CreateJournalDto = CreateJournalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "dogs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => JournalInfo),
    __metadata("design:type", JournalInfo)
], CreateJournalDto.prototype, "journalInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Excrements),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "excrements", void 0);
//# sourceMappingURL=create-journal.dto.js.map