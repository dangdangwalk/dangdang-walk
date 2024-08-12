"use strict";
Object.defineProperty(exports, "JournalsController", {
    enumerable: true,
    get: function() {
        return JournalsController;
    }
});
const _common = require("@nestjs/common");
const _createjournaldto = require("./dtos/create-journal.dto");
const _updatejournaldto = require("./dtos/update-journal.dto");
const _authjournalguard = require("./guards/auth-journal.guard");
const _journalsservice = require("./journals.service");
const _tokenservice = require("../auth/token/token.service");
const _authdogguard = require("../dogs/guards/auth-dog.guard");
const _datevalidationpipe = require("../statistics/pipes/date-validation.pipe");
const _userdecorator = require("../users/decorators/user.decorator");
const _authdogsguard = require("../walk/guards/auth-dogs.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let JournalsController = class JournalsController {
    async getJournalList(dogId, date, user) {
        return await this.journalsService.getJournalList(user.userId, dogId, date);
    }
    async createJournal(user, body) {
        await this.journalsService.createJournal(user.userId, body);
    }
    getJournalDetail(journalId) {
        return this.journalsService.getJournalDetail(journalId);
    }
    async updateJournal(journalId, body) {
        await this.journalsService.updateJournal(journalId, body);
    }
    async deleteJournal(user, journalId) {
        await this.journalsService.deleteJournal(user.userId, journalId);
    }
    constructor(journalsService){
        this.journalsService = journalsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_authdogguard.AuthDogGuard),
    _ts_param(0, (0, _common.Query)('dogId', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Query)('date', _datevalidationpipe.DateValidationPipe)),
    _ts_param(2, (0, _userdecorator.User)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        String,
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsController.prototype, "getJournalList", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_authdogsguard.AuthDogsGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        typeof _createjournaldto.CreateJournalDto === "undefined" ? Object : _createjournaldto.CreateJournalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsController.prototype, "createJournal", null);
_ts_decorate([
    (0, _common.Get)('/:id(\\d+)'),
    (0, _common.UseGuards)(_authjournalguard.AuthJournalGuard),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], JournalsController.prototype, "getJournalDetail", null);
_ts_decorate([
    (0, _common.Patch)('/:id(\\d+)'),
    (0, _common.HttpCode)(204),
    (0, _common.UseGuards)(_authjournalguard.AuthJournalGuard),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _updatejournaldto.UpdateJournalDto === "undefined" ? Object : _updatejournaldto.UpdateJournalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsController.prototype, "updateJournal", null);
_ts_decorate([
    (0, _common.Delete)('/:id(\\d+)'),
    (0, _common.HttpCode)(204),
    (0, _common.UseGuards)(_authjournalguard.AuthJournalGuard),
    _ts_param(0, (0, _userdecorator.User)()),
    _ts_param(1, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.AccessTokenPayload === "undefined" ? Object : _tokenservice.AccessTokenPayload,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsController.prototype, "deleteJournal", null);
JournalsController = _ts_decorate([
    (0, _common.Controller)('/journals'),
    (0, _common.UsePipes)(new _common.ValidationPipe({
        validateCustomDecorators: true,
        whitelist: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _journalsservice.JournalsService === "undefined" ? Object : _journalsservice.JournalsService
    ])
], JournalsController);

//# sourceMappingURL=journals.controller.js.map