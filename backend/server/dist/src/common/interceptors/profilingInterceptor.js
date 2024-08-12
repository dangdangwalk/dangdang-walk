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
exports.ProfilingInterceptor = void 0;
const fs = require("node:fs");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typeorm_2 = require("typeorm");
let ProfilingInterceptor = class ProfilingInterceptor {
    constructor(dataSource, configService) {
        this.dataSource = dataSource;
        this.configService = configService;
    }
    intercept(context, next) {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();
        return (0, rxjs_1.from)(this.initProfiling()).pipe((0, operators_1.switchMap)(() => {
            const now = Date.now();
            return next
                .handle()
                .pipe((0, operators_1.switchMap)((result) => (0, rxjs_1.from)(this.logProfilingData(method, originUrl, now)).pipe((0, operators_1.map)(() => result))));
        }));
    }
    async logProfilingData(method, originUrl, startTime) {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toLocaleString();
        const profiles = await this.dataSource.query('SHOW PROFILES');
        const queryDurations = profiles.map((profile) => ({
            Query: profile.Query,
            Duration: profile.Duration,
        }));
        fs.appendFileSync(`log/query-profiling.${this.configService.get('NODE_ENV')}.log`, `>> ${method} ${originUrl}\nTimestamp: ${timestamp}\nAPI Call Duration: ${duration}ms\nExecuted Queries: ${queryDurations.length}\nQueries: ${JSON.stringify(queryDurations, null, 2)}\n\n`);
    }
    async initProfiling() {
        await this.dataSource.query('SET profiling_history_size = 0');
        await this.dataSource.query('SET profiling_history_size = 100');
        await this.dataSource.query('SET profiling = 1');
    }
};
exports.ProfilingInterceptor = ProfilingInterceptor;
exports.ProfilingInterceptor = ProfilingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, typeorm_1.getDataSourceToken)())),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        config_1.ConfigService])
], ProfilingInterceptor);
//# sourceMappingURL=profilingInterceptor.js.map