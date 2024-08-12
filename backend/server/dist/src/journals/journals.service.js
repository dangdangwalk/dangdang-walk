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
exports.JournalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const journals_entity_1 = require("./journals.entity");
const journals_repository_1 = require("./journals.repository");
const journal_types_1 = require("./types/journal.types");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const dog_walk_day_service_1 = require("../dog-walk-day/dog-walk-day.service");
const dogs_service_1 = require("../dogs/dogs.service");
const excrements_service_1 = require("../excrements/excrements.service");
const excrement_type_1 = require("../excrements/types/excrement.type");
const journals_dogs_entity_1 = require("../journals-dogs/journals-dogs.entity");
const journals_dogs_service_1 = require("../journals-dogs/journals-dogs.service");
const s3_service_1 = require("../s3/s3.service");
const today_walk_time_service_1 = require("../today-walk-time/today-walk-time.service");
const date_util_1 = require("../utils/date.util");
const manipulate_util_1 = require("../utils/manipulate.util");
let JournalsService = class JournalsService {
    constructor(journalsRepository, journalsDogsService, dogsService, excrementsService, dogWalkDayService, todayWalkTimeService, entityManager, s3Service, logger) {
        this.journalsRepository = journalsRepository;
        this.journalsDogsService = journalsDogsService;
        this.dogsService = dogsService;
        this.excrementsService = excrementsService;
        this.dogWalkDayService = dogWalkDayService;
        this.todayWalkTimeService = todayWalkTimeService;
        this.entityManager = entityManager;
        this.s3Service = s3Service;
        this.logger = logger;
    }
    async create(entityData) {
        const journals = new journals_entity_1.Journals(entityData);
        return await this.journalsRepository.create(journals);
    }
    async delete(journalId) {
        const where = { id: journalId };
        return await this.journalsRepository.delete(where);
    }
    async update(journalId, updateData) {
        this.journalsRepository.update({ id: journalId }, updateData);
    }
    async getOwnJournalIds(userId) {
        const ownJournals = await this.journalsRepository.find({ where: { userId }, select: ['id'] });
        return ownJournals.map((cur) => cur.id);
    }
    async checkJournalOwnership(userId, journalIds) {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return (0, manipulate_util_1.checkIfExistsInArr)(myJournalIds, journalIds);
    }
    makeJournalInfoForDetail(journalId, journalInfoRaw) {
        const journalInfo = (0, manipulate_util_1.makeSubObject)(journalInfoRaw, journal_types_1.JournalOutputForDetail.getFieldForJournalTable());
        journalInfo.id = journalId;
        journalInfo.routes = journalInfoRaw.routes ? JSON.parse(journalInfoRaw.routes) : [];
        journalInfo.journalPhotos = journalInfoRaw.journalPhotos ? JSON.parse(journalInfoRaw.journalPhotos) : '';
        journalInfo.excrementCount = journalInfoRaw.excrementCount ? JSON.parse(journalInfoRaw.excrementCount) : {};
        return journalInfo;
    }
    async getDogsInfoForDetail(dogIds) {
        const dogInfoRaw = await this.dogsService.find({
            where: { id: (0, typeorm_1.In)(dogIds) },
            select: journal_types_1.DogOutputForDetail.getFieldForDogTable(),
        });
        return (0, manipulate_util_1.makeSubObjectsArray)(dogInfoRaw, journal_types_1.DogOutputForDetail.getFieldForDogTable());
    }
    async getJournalDetail(journalId) {
        const journalDogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const [journalInfoRaw, dogInfo] = await Promise.all([
            await this.journalsRepository.findOne({
                where: { id: journalId },
                select: [...journal_types_1.JournalOutputForDetail.getFieldForJournalTable()],
            }),
            this.getDogsInfoForDetail(journalDogIds),
        ]);
        const journalInfo = this.makeJournalInfoForDetail(journalId, journalInfoRaw);
        return new journal_types_1.JournalDetailResponse(journalInfo, dogInfo);
    }
    makeJournalData(userId, journalInputForCreate, excrementsInputForCreate) {
        const journalData = {
            ...(0, manipulate_util_1.makeSubObject)(journalInputForCreate, journal_types_1.CreateJournalDatabaseInput.getKeysForJournalRequest()),
            userId,
        };
        const excrementsCntArr = excrementsInputForCreate.map((cur) => ({
            dogId: cur.dogId,
            fecesCnt: cur.fecesLocations.length,
            urineCnt: cur.urineLocations.length,
        }));
        journalData.memo = journalInputForCreate.memo ? journalInputForCreate.memo : '';
        journalData.excrementCount = JSON.stringify(excrementsCntArr);
        journalData.journalPhotos = JSON.stringify(journalInputForCreate.journalPhotos ? journalInputForCreate.journalPhotos : []);
        journalData.routes = JSON.stringify(journalInputForCreate.routes);
        return journalData;
    }
    async updateDogWalkDay(dogIds, operation) {
        const dogWalkDayIds = await this.dogsService.getRelatedTableIdList(dogIds, 'walkDayId');
        await this.dogWalkDayService.updateDailyWalkCount(dogWalkDayIds, operation);
    }
    async updateTodayWalkTime(dogIds, duration, operation) {
        const todayWalkTimeIds = await this.dogsService.getRelatedTableIdList(dogIds, 'todayWalkTimeId');
        await this.todayWalkTimeService.updateDurations(todayWalkTimeIds, duration, operation);
    }
    async createExcrements(journalId, excrements) {
        const excrementsEntity = [];
        for (const curExcrements of excrements) {
            const { dogId, fecesLocations, urineLocations } = curExcrements;
            const createExcrementEntity = (journalId, dogId, type, coordinate) => ({
                journalId,
                dogId,
                type,
                coordinate: this.excrementsService.makeCoordinate(coordinate[0], coordinate[1]),
            });
            excrementsEntity.push(...fecesLocations.map((coordinate) => createExcrementEntity(journalId, dogId, excrement_type_1.EXCREMENT.Feces, coordinate)), ...urineLocations.map((coordinate) => createExcrementEntity(journalId, dogId, excrement_type_1.EXCREMENT.Urine, coordinate)));
        }
        return await this.excrementsService.insert(excrementsEntity);
    }
    async createJournal(userId, createJournalRequest) {
        const dogIds = createJournalRequest.dogs;
        const journalDatabaseInput = this.makeJournalData(userId, createJournalRequest.journalInfo, createJournalRequest.excrements);
        const createJournalResult = await this.create(journalDatabaseInput);
        await this.journalsDogsService.createJournalDogs(createJournalResult.id, dogIds);
        const addDogWalkDay = (current) => (current += 1);
        const addTodayWalkTime = (current, value) => current + value;
        await this.updateDogWalkDay(dogIds, addDogWalkDay);
        await this.updateTodayWalkTime(dogIds, createJournalRequest.journalInfo.duration, addTodayWalkTime);
        if (createJournalRequest.excrements && createJournalRequest.excrements.length) {
            await this.createExcrements(createJournalResult.id, createJournalRequest.excrements);
        }
    }
    async updateJournal(journalId, updateJournalRequest) {
        const updateJournalDatabaseInput = {
            memo: updateJournalRequest.memo ? updateJournalRequest.memo : '',
            journalPhotos: updateJournalRequest.journalPhotos
                ? JSON.stringify(updateJournalRequest.journalPhotos)
                : '[]',
        };
        await this.update(journalId, updateJournalDatabaseInput);
    }
    async deleteJournal(userId, journalId) {
        const dogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const journalRaw = await this.journalsRepository.findOne({ where: { id: journalId } });
        const journalPhotos = JSON.parse(journalRaw.journalPhotos);
        const subtractTodayWalkTime = (current, value) => current - value;
        const subtractDogWalkDay = (current) => (current -= 1);
        await this.updateDogWalkDay(dogIds, subtractDogWalkDay);
        await this.updateTodayWalkTime(dogIds, journalRaw.duration, subtractTodayWalkTime);
        await this.s3Service.deleteObjects(userId, journalPhotos);
        await this.delete(journalId);
    }
    async findUserDogJournalsByDate(userId, dogId, startDate, endDate) {
        return await this.entityManager.query(`
        SELECT STRAIGHT_JOIN journals.distance, journals.duration, journals.started_at as startedAt 
        FROM journals 
        INNER JOIN journals_dogs ON journals.id = journals_dogs.journal_id
        WHERE journals.user_id = ?
          AND journals_dogs.dog_id = ?
          AND journals.started_at >= ?
          AND journals.started_at < ?
      `, [userId, dogId, startDate, endDate]);
    }
    getTotal(journals) {
        const totals = journals.reduce((acc, journal) => {
            acc.totalWalkCnt += 1;
            acc.totalDistance += journal.distance;
            acc.totalTime += journal.duration;
            return acc;
        }, { totalWalkCnt: 0, totalDistance: 0, totalTime: 0 });
        return totals;
    }
    async findJournalsAndGetTotal(userId, dogId, startDate, endDate) {
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return this.getTotal(dogJournals);
    }
    aggregateJournalsByDate(journals, startDate, endDate) {
        const journalCntAMonth = {};
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = (0, date_util_1.formatDate)(currentDate);
            journalCntAMonth[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        journals.forEach((journal) => {
            const journalDate = new Date(journal.startedAt);
            const dateString = (0, date_util_1.formatDate)(journalDate);
            journalCntAMonth[dateString]++;
        });
        return journalCntAMonth;
    }
    async findJournalsAndAggregateByDay(userId, dogId, startDate, endDate) {
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return Promise.resolve(this.aggregateJournalsByDate(dogJournals, startDate, endDate));
    }
    async getJournalIdsByDogIdAndDate(userId, dogId, date) {
        const startEndDate = (0, date_util_1.getStartAndEndOfDay)(new Date(date));
        const result = await this.entityManager
            .createQueryBuilder(journals_entity_1.Journals, 'journals')
            .select([
            'journals.id AS "journalId"',
            'journals.started_at AS "startedAt"',
            'distance',
            'calories',
            'duration',
            '(SELECT COUNT(*) FROM journals_dogs jd WHERE jd.dog_id = :dogId AND jd.journal_id <= journals.id ) AS "journalCnt"',
        ])
            .innerJoin(journals_dogs_entity_1.JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.user_id = :userId', { userId })
            .andWhere('journals.started_at >= :startDate', { startDate: startEndDate.startDate })
            .andWhere('journals.started_at < :endDate', { endDate: startEndDate.endDate })
            .getRawMany();
        return result.map((cur) => ({
            ...cur,
            journalCnt: parseInt(cur.journalCnt),
        }));
    }
    async getJournalList(userId, dogId, date) {
        const journalListRaw = await this.getJournalIdsByDogIdAndDate(userId, dogId, date);
        if (!journalListRaw.length) {
            return [];
        }
        const journalListResponse = (0, manipulate_util_1.makeSubObjectsArray)(journalListRaw, journal_types_1.JournalListResponse.getKeysForJournalListRaw());
        return journalListResponse;
    }
};
exports.JournalsService = JournalsService;
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], JournalsService.prototype, "createJournal", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], JournalsService.prototype, "updateJournal", null);
__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], JournalsService.prototype, "deleteJournal", null);
exports.JournalsService = JournalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journals_repository_1.JournalsRepository,
        journals_dogs_service_1.JournalsDogsService,
        dogs_service_1.DogsService,
        excrements_service_1.ExcrementsService,
        dog_walk_day_service_1.DogWalkDayService,
        today_walk_time_service_1.TodayWalkTimeService,
        typeorm_1.EntityManager,
        s3_service_1.S3Service,
        winstonLogger_service_1.WinstonLoggerService])
], JournalsService);
//# sourceMappingURL=journals.service.js.map