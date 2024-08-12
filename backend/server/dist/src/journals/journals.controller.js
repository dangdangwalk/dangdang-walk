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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsController = void 0;
const common_1 = require("@nestjs/common");
const create_journal_dto_1 = require("./dtos/create-journal.dto");
const update_journal_dto_1 = require("./dtos/update-journal.dto");
const auth_journal_guard_1 = require("./guards/auth-journal.guard");
const journals_service_1 = require("./journals.service");
const auth_dog_guard_1 = require("../dogs/guards/auth-dog.guard");
const date_validation_pipe_1 = require("../statistics/pipes/date-validation.pipe");
const user_decorator_1 = require("../users/decorators/user.decorator");
const auth_dogs_guard_1 = require("../walk/guards/auth-dogs.guard");
let JournalsController = class JournalsController {
    constructor(journalsService) {
        this.journalsService = journalsService;
    }
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
};
exports.JournalsController = JournalsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_dog_guard_1.AuthDogGuard),
    __param(0, (0, common_1.Query)('dogId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date', date_validation_pipe_1.DateValidationPipe)),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "getJournalList", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_dogs_guard_1.AuthDogsGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_journal_dto_1.CreateJournalDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "createJournal", null);
__decorate([
    (0, common_1.Get)('/:id(\\d+)'),
    (0, common_1.UseGuards)(auth_journal_guard_1.AuthJournalGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], JournalsController.prototype, "getJournalDetail", null);
__decorate([
    (0, common_1.Patch)('/:id(\\d+)'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(auth_journal_guard_1.AuthJournalGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_journal_dto_1.UpdateJournalDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "updateJournal", null);
__decorate([
    (0, common_1.Delete)('/:id(\\d+)'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(auth_journal_guard_1.AuthJournalGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "deleteJournal", null);
exports.JournalsController = JournalsController = __decorate([
    (0, common_1.Controller)('/journals'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ validateCustomDecorators: true, whitelist: true })),
    __metadata("design:paramtypes", [journals_service_1.JournalsService])
], JournalsController);
//# sourceMappingURL=journals.controller.js.map