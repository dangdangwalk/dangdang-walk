"use strict";
Object.defineProperty(exports, "DatabaseModule", {
    enumerable: true,
    get: function() {
        return DatabaseModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _typeormextension = require("typeorm-extension");
const _typeormtransactional = require("typeorm-transactional");
const _breedseeder = require("./seeds/breed.seeder");
const _breedentity = require("../../breed/breed.entity");
const _dogwalkdayentity = require("../../dog-walk-day/dog-walk-day.entity");
const _dogsentity = require("../../dogs/dogs.entity");
const _excrementsentity = require("../../excrements/excrements.entity");
const _journalsentity = require("../../journals/journals.entity");
const _journalsdogsentity = require("../../journals-dogs/journals-dogs.entity");
const _todaywalktimeentity = require("../../today-walk-time/today-walk-time.entity");
const _usersentity = require("../../users/users.entity");
const _usersdogsentity = require("../../users-dogs/users-dogs.entity");
const _ansiutil = require("../../utils/ansi.util");
const _winstonLoggerservice = require("../logger/winstonLogger.service");
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
let DatabaseModule = class DatabaseModule {
    async onModuleInit() {
        await (0, _typeormextension.runSeeders)(this.dataSource, {
            seeds: [
                _breedseeder.default
            ]
        });
        this.logger.log((0, _ansiutil.color)('Seed data applied successfully.', 'Yellow'));
    }
    static forFeature(models) {
        return _typeorm.TypeOrmModule.forFeature(models);
    }
    constructor(dataSource, logger){
        this.dataSource = dataSource;
        this.logger = logger;
    }
};
DatabaseModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forRootAsync({
                inject: [
                    _config.ConfigService
                ],
                useFactory: (config)=>{
                    const nodeEnv = config.get('NODE_ENV');
                    const enableQueryLogger = config.get('ENABLE_QUERY_LOGGER');
                    return {
                        type: 'mysql',
                        host: config.get('MYSQL_HOST'),
                        port: config.get('MYSQL_PORT'),
                        username: config.get('MYSQL_ROOT_USER'),
                        password: config.get('MYSQL_ROOT_PASSWORD'),
                        database: config.get('MYSQL_DATABASE'),
                        entities: [
                            _breedentity.Breed,
                            _dogwalkdayentity.DogWalkDay,
                            _dogsentity.Dogs,
                            _excrementsentity.Excrements,
                            _journalsentity.Journals,
                            _journalsdogsentity.JournalsDogs,
                            _todaywalktimeentity.TodayWalkTime,
                            _usersentity.Users,
                            _usersdogsentity.UsersDogs
                        ],
                        synchronize: true,
                        timezone: 'Z',
                        legacySpatialSupport: false,
                        ...enableQueryLogger ? {
                            logger: new _typeorm1.FileLogger(true, {
                                logPath: `log/ormlogs.${nodeEnv}.log`
                            })
                        } : {}
                    };
                },
                async dataSourceFactory (options) {
                    if (!options) {
                        throw new Error('옵션이 없습니다');
                    }
                    return (0, _typeormtransactional.getDataSourceByName)('default') || (0, _typeormtransactional.addTransactionalDataSource)(new _typeorm1.DataSource(options));
                }
            })
        ]
    }),
    _ts_param(0, (0, _common.Inject)((0, _typeorm.getDataSourceToken)())),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], DatabaseModule);

//# sourceMappingURL=database.module.js.map