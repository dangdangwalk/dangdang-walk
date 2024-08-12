"use strict";
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _todaywalktimeentity = require("./today-walk-time.entity");
const _todaywalktimerepository = require("./today-walk-time.repository");
const _todaywalktimeservice = require("./today-walk-time.service");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
describe('ExcrementsService', ()=>{
    let service;
    let todayWalkTimeRepository;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _todaywalktimerepository.TodayWalkTimeRepository,
                _todaywalktimeservice.TodayWalkTimeService,
                _winstonLoggerservice.WinstonLoggerService,
                _typeorm1.EntityManager,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_todaywalktimeentity.TodayWalkTime),
                    useClass: _typeorm1.Repository
                }
            ]
        }).compile();
        service = module.get(_todaywalktimeservice.TodayWalkTimeService);
        todayWalkTimeRepository = module.get((0, _typeorm.getRepositoryToken)(_todaywalktimeentity.TodayWalkTime));
    });
    const mockWalkTimes = [
        {
            id: 1,
            duration: 4109,
            updatedAt: new Date('2024-06-23T00:00:00Z'),
            setUpdatedAtBeforeUpdate: function() {
                this.updatedAt = new Date();
            }
        },
        {
            id: 2,
            duration: 5000,
            updatedAt: new Date('2024-06-23T05:17:07.000Z'),
            setUpdatedAtBeforeUpdate: function() {
                this.updatedAt = new Date();
            }
        },
        {
            id: 3,
            duration: 5,
            updatedAt: new Date('2024-06-23T05:17:07.000Z'),
            setUpdatedAtBeforeUpdate: function() {
                this.updatedAt = new Date();
            }
        }
    ];
    describe('updateDurations', ()=>{
        beforeEach(()=>{
            jest.spyOn(todayWalkTimeRepository, 'find').mockImplementation(createMockFindImplementation());
            jest.spyOn(todayWalkTimeRepository, 'update').mockResolvedValue({
                affected: 1
            });
        });
        context('존재하지 않는 walkTimeIds가 주어지면', ()=>{
            it('NotFoundException 예외를 던져야 한다.', async ()=>{
                await expect(service.updateDurations([
                    99,
                    100
                ], 10, (current, operand)=>current + operand)).rejects.toThrow(new _common.NotFoundException('id: 99,100와 일치하는 레코드가 없습니다'));
            });
        });
    });
    const createMockFindImplementation = ()=>{
        return (options)=>{
            if (!(options === null || options === void 0 ? void 0 : options.where)) {
                return Promise.resolve(mockWalkTimes);
            }
            const whereClause = options.where;
            const findOperator = whereClause.id;
            const idList = findOperator._value;
            return Promise.resolve(mockWalkTimes.filter((walkTime)=>idList.includes(walkTime.id)));
        };
    };
});

//# sourceMappingURL=today-walk-time.service.spec.js.map