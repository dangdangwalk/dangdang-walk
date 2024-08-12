"use strict";
Object.defineProperty(exports, "AuthJournalGuard", {
    enumerable: true,
    get: function() {
        return AuthJournalGuard;
    }
});
const _common = require("@nestjs/common");
const _winstonLoggerservice = require("../../common/logger/winstonLogger.service");
const _journalsservice = require("../journals.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthJournalGuard = class AuthJournalGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const journalId = parseInt(request.params.id);
        await this.checkJournalOwnership(userId, journalId);
        return true;
    }
    async checkJournalOwnership(userId, journalId) {
        const [owned] = await this.journalsService.checkJournalOwnership(userId, journalId);
        if (!owned) {
            const error = new _common.ForbiddenException(`유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`);
            var _error_stack;
            this.logger.error(`유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`, {
                trace: (_error_stack = error.stack) !== null && _error_stack !== void 0 ? _error_stack : '스택 없음'
            });
            throw error;
        }
    }
    constructor(journalsService, logger){
        this.journalsService = journalsService;
        this.logger = logger;
    }
};
AuthJournalGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _journalsservice.JournalsService === "undefined" ? Object : _journalsservice.JournalsService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], AuthJournalGuard);

//# sourceMappingURL=auth-journal.guard.js.map