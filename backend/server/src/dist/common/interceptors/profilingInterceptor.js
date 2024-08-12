"use strict";
Object.defineProperty(exports, "ProfilingInterceptor", {
    enumerable: true,
    get: function() {
        return ProfilingInterceptor;
    }
});
const _nodefs = require("node:fs");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _rxjs = require("rxjs");
const _operators = require("rxjs/operators");
const _typeorm1 = require("typeorm");
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
let ProfilingInterceptor = class ProfilingInterceptor {
    intercept(context, next) {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();
        return (0, _rxjs.from)(this.initProfiling()).pipe((0, _operators.switchMap)(()=>{
            const now = Date.now();
            return next.handle().pipe((0, _operators.switchMap)((result)=>(0, _rxjs.from)(this.logProfilingData(method, originUrl, now)).pipe((0, _operators.map)(()=>result))));
        }));
    }
    async logProfilingData(method, originUrl, startTime) {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toLocaleString();
        const profiles = await this.dataSource.query('SHOW PROFILES');
        const queryDurations = profiles.map((profile)=>({
                Query: profile.Query,
                Duration: profile.Duration
            }));
        _nodefs.appendFileSync(`log/query-profiling.${this.configService.get('NODE_ENV')}.log`, `>> ${method} ${originUrl}\nTimestamp: ${timestamp}\nAPI Call Duration: ${duration}ms\nExecuted Queries: ${queryDurations.length}\nQueries: ${JSON.stringify(queryDurations, null, 2)}\n\n`);
    }
    async initProfiling() {
        await this.dataSource.query('SET profiling_history_size = 0');
        await this.dataSource.query('SET profiling_history_size = 100');
        await this.dataSource.query('SET profiling = 1');
    }
    constructor(dataSource, configService){
        this.dataSource = dataSource;
        this.configService = configService;
    }
};
ProfilingInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _typeorm.getDataSourceToken)())),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], ProfilingInterceptor);

//# sourceMappingURL=profilingInterceptor.js.map