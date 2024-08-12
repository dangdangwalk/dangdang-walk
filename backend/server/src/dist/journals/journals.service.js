"use strict";
Object.defineProperty(exports, "JournalsService", {
    enumerable: true,
    get: function() {
        return JournalsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _typeormtransactional = require("typeorm-transactional");
const _journalsentity = require("./journals.entity");
const _journalsrepository = require("./journals.repository");
const _journaltypes = require("./types/journal.types");
const _dogwalkdayservice = require("../dog-walk-day/dog-walk-day.service");
const _dogsservice = require("../dogs/dogs.service");
const _excrementsservice = require("../excrements/excrements.service");
const _excrementtype = require("../excrements/types/excrement.type");
const _journalsdogsentity = require("../journals-dogs/journals-dogs.entity");
const _journalsdogsservice = require("../journals-dogs/journals-dogs.service");
const _s3service = require("../s3/s3.service");
const _todaywalktimeservice = require("../today-walk-time/today-walk-time.service");
const _dateutil = require("../utils/date.util");
const _manipulateutil = require("../utils/manipulate.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JournalsService = class JournalsService {
    async create(entityData) {
        const journals = new _journalsentity.Journals(entityData);
        return await this.journalsRepository.create(journals);
    }
    async delete(journalId) {
        const where = {
            id: journalId
        };
        return await this.journalsRepository.delete(where);
    }
    async update(journalId, updateData) {
        this.journalsRepository.update({
            id: journalId
        }, updateData);
    }
    async getOwnJournalIds(userId) {
        const ownJournals = await this.journalsRepository.find({
            where: {
                userId
            },
            select: [
                'id'
            ]
        });
        return ownJournals.map((cur)=>cur.id);
    }
    async checkJournalOwnership(userId, journalIds) {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return (0, _manipulateutil.checkIfExistsInArr)(myJournalIds, journalIds);
    }
    makeJournalInfoForDetail(journalId, journalInfoRaw) {
        const journalInfo = (0, _manipulateutil.makeSubObject)(journalInfoRaw, _journaltypes.JournalOutputForDetail.getFieldForJournalTable());
        journalInfo.id = journalId;
        journalInfo.routes = JSON.parse(journalInfoRaw.routes);
        journalInfo.journalPhotos = JSON.parse(journalInfoRaw.journalPhotos);
        journalInfo.excrementCount = JSON.parse(journalInfoRaw.excrementCount);
        return journalInfo;
    }
    async getDogsInfoForDetail(dogIds) {
        const dogInfoRaw = await this.dogsService.find({
            where: {
                id: (0, _typeorm.In)(dogIds)
            },
            select: _journaltypes.DogOutputForDetail.getFieldForDogTable()
        });
        return (0, _manipulateutil.makeSubObjectsArray)(dogInfoRaw, _journaltypes.DogOutputForDetail.getFieldForDogTable());
    }
    async getJournalDetail(journalId) {
        const journalDogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const [journalInfoRaw, dogInfo] = await Promise.all([
            await this.journalsRepository.findOne({
                where: {
                    id: journalId
                },
                select: [
                    ..._journaltypes.JournalOutputForDetail.getFieldForJournalTable()
                ]
            }),
            this.getDogsInfoForDetail(journalDogIds)
        ]);
        const journalInfo = this.makeJournalInfoForDetail(journalId, journalInfoRaw);
        return new _journaltypes.JournalDetailResponse(journalInfo, dogInfo);
    }
    makeJournalData(userId, journalInputForCreate, excrementsInputForCreate) {
        const journalData = {
            ...(0, _manipulateutil.makeSubObject)(journalInputForCreate, _journaltypes.CreateJournalDatabaseInput.getKeysForJournalRequest()),
            userId
        };
        const excrementsCntArr = excrementsInputForCreate.map((cur)=>({
                dogId: cur.dogId,
                fecesCnt: cur.fecesLocations.length,
                urineCnt: cur.urineLocations.length
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
        for (const curExcrements of excrements){
            const { dogId, fecesLocations, urineLocations } = curExcrements;
            const createExcrementEntity = (journalId, dogId, type, coordinate)=>({
                    journalId,
                    dogId,
                    type,
                    coordinate: this.excrementsService.makeCoordinate(coordinate[0], coordinate[1])
                });
            excrementsEntity.push(...fecesLocations.map((coordinate)=>createExcrementEntity(journalId, dogId, _excrementtype.EXCREMENT.Feces, coordinate)), ...urineLocations.map((coordinate)=>createExcrementEntity(journalId, dogId, _excrementtype.EXCREMENT.Urine, coordinate)));
        }
        return await this.excrementsService.insert(excrementsEntity);
    }
    async createJournal(userId, createJournalRequest) {
        const dogIds = createJournalRequest.dogs;
        const journalDatabaseInput = this.makeJournalData(userId, createJournalRequest.journalInfo, createJournalRequest.excrements);
        const createJournalResult = await this.create(journalDatabaseInput);
        await this.journalsDogsService.createJournalDogs(createJournalResult.id, dogIds);
        const addDogWalkDay = (current)=>current += 1;
        const addTodayWalkTime = (current, value)=>current + value;
        await this.updateDogWalkDay(dogIds, addDogWalkDay);
        await this.updateTodayWalkTime(dogIds, createJournalRequest.journalInfo.duration, addTodayWalkTime);
        if (createJournalRequest.excrements && createJournalRequest.excrements.length) {
            await this.createExcrements(createJournalResult.id, createJournalRequest.excrements);
        }
    }
    async updateJournal(journalId, updateJournalRequest) {
        const updateJournalDatabaseInput = {
            memo: updateJournalRequest.memo ? updateJournalRequest.memo : '',
            journalPhotos: updateJournalRequest.journalPhotos ? JSON.stringify(updateJournalRequest.journalPhotos) : '[]'
        };
        await this.update(journalId, updateJournalDatabaseInput);
    }
    async deleteJournal(userId, journalId) {
        const dogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
        const journalRaw = await this.journalsRepository.findOne({
            where: {
                id: journalId
            }
        });
        const journalPhotos = JSON.parse(journalRaw.journalPhotos);
        const subtractTodayWalkTime = (current, value)=>current - value;
        const subtractDogWalkDay = (current)=>current -= 1;
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
      `, [
            userId,
            dogId,
            startDate,
            endDate
        ]);
    }
    getTotal(journals) {
        const totals = journals.reduce((acc, journal)=>{
            acc.totalWalkCnt += 1;
            acc.totalDistance += journal.distance;
            acc.totalTime += journal.duration;
            return acc;
        }, {
            totalWalkCnt: 0,
            totalDistance: 0,
            totalTime: 0
        });
        return totals;
    }
    async findJournalsAndGetTotal(userId, dogId, startDate, endDate) {
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return this.getTotal(dogJournals);
    }
    aggregateJournalsByDate(journals, startDate, endDate) {
        const journalCntAMonth = {};
        const currentDate = new Date(startDate);
        while(currentDate <= endDate){
            const dateString = (0, _dateutil.formatDate)(currentDate);
            journalCntAMonth[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        journals.forEach((journal)=>{
            const journalDate = new Date(journal.startedAt);
            const dateString = (0, _dateutil.formatDate)(journalDate);
            journalCntAMonth[dateString]++;
        });
        return journalCntAMonth;
    }
    async findJournalsAndAggregateByDay(userId, dogId, startDate, endDate) {
        const dogJournals = await this.findUserDogJournalsByDate(userId, dogId, startDate, endDate);
        return Promise.resolve(this.aggregateJournalsByDate(dogJournals, startDate, endDate));
    }
    async getJournalIdsByDogIdAndDate(userId, dogId, date) {
        const startEndDate = (0, _dateutil.getStartAndEndOfDay)(new Date(date));
        const result = await this.entityManager.createQueryBuilder(_journalsentity.Journals, 'journals').select([
            'journals.id AS "journalId"',
            'journals.started_at AS "startedAt"',
            'distance',
            'calories',
            'duration'
        ]).innerJoin(_journalsdogsentity.JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id').where('journals_dogs.dog_id = :dogId', {
            dogId
        }).andWhere('journals.user_id = :userId', {
            userId
        }).andWhere('journals.started_at >= :startDate', {
            startDate: startEndDate.startDate
        }).andWhere('journals.started_at < :endDate', {
            endDate: startEndDate.endDate
        }).orderBy('journals.id', 'ASC').getRawMany();
        if (!result.length) {
            return [];
        }
        const firstJournalId = result[0].journalId;
        let initCount = await this.entityManager.createQueryBuilder(_journalsdogsentity.JournalsDogs, 'journals_dogs').where('journals_dogs.dog_id = :dogId', {
            dogId
        }).andWhere('journals_dogs.journal_id <= :firstJournalId', {
            firstJournalId
        }).getCount();
        return result.map((cur)=>({
                ...cur,
                journalCnt: initCount++
            }));
    }
    async getJournalList(userId, dogId, date) {
        const journalListRaw = await this.getJournalIdsByDogIdAndDate(userId, dogId, date);
        if (!journalListRaw.length) {
            return [];
        }
        const journalListResponse = (0, _manipulateutil.makeSubObjectsArray)(journalListRaw, _journaltypes.JournalListResponse.getKeysForJournalListRaw());
        return journalListResponse;
    }
    constructor(journalsRepository, journalsDogsService, dogsService, excrementsService, dogWalkDayService, todayWalkTimeService, entityManager, s3Service){
        this.journalsRepository = journalsRepository;
        this.journalsDogsService = journalsDogsService;
        this.dogsService = dogsService;
        this.excrementsService = excrementsService;
        this.dogWalkDayService = dogWalkDayService;
        this.todayWalkTimeService = todayWalkTimeService;
        this.entityManager = entityManager;
        this.s3Service = s3Service;
    }
};
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _journaltypes.CreateJournalRequest === "undefined" ? Object : _journaltypes.CreateJournalRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsService.prototype, "createJournal", null);
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _journaltypes.UpdateJournalRequest === "undefined" ? Object : _journaltypes.UpdateJournalRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsService.prototype, "updateJournal", null);
_ts_decorate([
    (0, _typeormtransactional.Transactional)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], JournalsService.prototype, "deleteJournal", null);
JournalsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _journalsrepository.JournalsRepository === "undefined" ? Object : _journalsrepository.JournalsRepository,
        typeof _journalsdogsservice.JournalsDogsService === "undefined" ? Object : _journalsdogsservice.JournalsDogsService,
        typeof _dogsservice.DogsService === "undefined" ? Object : _dogsservice.DogsService,
        typeof _excrementsservice.ExcrementsService === "undefined" ? Object : _excrementsservice.ExcrementsService,
        typeof _dogwalkdayservice.DogWalkDayService === "undefined" ? Object : _dogwalkdayservice.DogWalkDayService,
        typeof _todaywalktimeservice.TodayWalkTimeService === "undefined" ? Object : _todaywalktimeservice.TodayWalkTimeService,
        typeof _typeorm.EntityManager === "undefined" ? Object : _typeorm.EntityManager,
        typeof _s3service.S3Service === "undefined" ? Object : _s3service.S3Service
    ])
], JournalsService);

//# sourceMappingURL=journals.service.js.map