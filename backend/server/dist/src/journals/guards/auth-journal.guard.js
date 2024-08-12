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
exports.AuthJournalGuard = void 0;
const common_1 = require("@nestjs/common");
const winstonLogger_service_1 = require("../../common/logger/winstonLogger.service");
const journals_service_1 = require("../journals.service");
let AuthJournalGuard = class AuthJournalGuard {
    constructor(journalsService, logger) {
        this.journalsService = journalsService;
        this.logger = logger;
    }
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
            const error = new common_1.ForbiddenException(`유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`);
            this.logger.error(`유저 ${userId}은/는 산책일지 ${journalId}에 대한 접근 권한이 없습니다`, {
                trace: error.stack ?? '스택 없음',
            });
            throw error;
        }
    }
};
exports.AuthJournalGuard = AuthJournalGuard;
exports.AuthJournalGuard = AuthJournalGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journals_service_1.JournalsService,
        winstonLogger_service_1.WinstonLoggerService])
], AuthJournalGuard);
//# sourceMappingURL=auth-journal.guard.js.map