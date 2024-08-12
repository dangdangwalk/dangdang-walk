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
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_extension_1 = require("typeorm-extension");
const typeorm_transactional_1 = require("typeorm-transactional");
const breed_seeder_1 = require("./seeds/breed.seeder");
const breed_entity_1 = require("../../breed/breed.entity");
const dog_walk_day_entity_1 = require("../../dog-walk-day/dog-walk-day.entity");
const dogs_entity_1 = require("../../dogs/dogs.entity");
const excrements_entity_1 = require("../../excrements/excrements.entity");
const journals_entity_1 = require("../../journals/journals.entity");
const journals_dogs_entity_1 = require("../../journals-dogs/journals-dogs.entity");
const today_walk_time_entity_1 = require("../../today-walk-time/today-walk-time.entity");
const users_entity_1 = require("../../users/users.entity");
const users_dogs_entity_1 = require("../../users-dogs/users-dogs.entity");
const ansi_util_1 = require("../../utils/ansi.util");
const winstonLogger_service_1 = require("../logger/winstonLogger.service");
let DatabaseModule = class DatabaseModule {
    constructor(dataSource, logger) {
        this.dataSource = dataSource;
        this.logger = logger;
    }
    async onModuleInit() {
        await (0, typeorm_extension_1.runSeeders)(this.dataSource, { seeds: [breed_seeder_1.default] });
        this.logger.log((0, ansi_util_1.color)('Seed data applied successfully.', 'Yellow'));
    }
    static forFeature(models) {
        return typeorm_1.TypeOrmModule.forFeature(models);
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
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
                            breed_entity_1.Breed,
                            dog_walk_day_entity_1.DogWalkDay,
                            dogs_entity_1.Dogs,
                            excrements_entity_1.Excrements,
                            journals_entity_1.Journals,
                            journals_dogs_entity_1.JournalsDogs,
                            today_walk_time_entity_1.TodayWalkTime,
                            users_entity_1.Users,
                            users_dogs_entity_1.UsersDogs,
                        ],
                        synchronize: true,
                        timezone: 'Z',
                        legacySpatialSupport: false,
                        ...(enableQueryLogger
                            ? { logger: new typeorm_2.FileLogger(true, { logPath: `log/ormlogs.${nodeEnv}.log` }) }
                            : {}),
                    };
                },
                async dataSourceFactory(options) {
                    if (!options) {
                        throw new Error('옵션이 없습니다');
                    }
                    return (0, typeorm_transactional_1.getDataSourceByName)('default') || (0, typeorm_transactional_1.addTransactionalDataSource)(new typeorm_2.DataSource(options));
                },
            }),
        ],
    }),
    __param(0, (0, common_1.Inject)((0, typeorm_1.getDataSourceToken)())),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        winstonLogger_service_1.WinstonLoggerService])
], DatabaseModule);
//# sourceMappingURL=database.module.js.map