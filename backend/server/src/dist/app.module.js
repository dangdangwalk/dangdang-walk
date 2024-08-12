"use strict";
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _nestjsprometheus = require("@willsoto/nestjs-prometheus");
const _appcontroller = require("./app.controller");
const _authmodule = require("./auth/auth.module");
const _databasemodule = require("./common/database/database.module");
const _healthcontroller = require("./common/health/health.controller");
const _logginginterceptor = require("./common/interceptors/logging.interceptor");
const _profilingInterceptor = require("./common/interceptors/profilingInterceptor");
const _prometheusinterceptor = require("./common/interceptors/prometheus.interceptor");
const _winstonLoggermodule = require("./common/logger/winstonLogger.module");
const _statisticsmodule = require("./statistics/statistics.module");
const _walkmodule = require("./walk/walk.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _databasemodule.DatabaseModule,
            _winstonLoggermodule.WinstonLoggerModule,
            _config.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`
            }),
            _nestjsprometheus.PrometheusModule.register({
                path: '/metrics',
                defaultMetrics: {
                    enabled: true
                }
            }),
            _authmodule.AuthModule,
            _statisticsmodule.StatisticsModule,
            _walkmodule.WalkModule
        ],
        controllers: [
            _appcontroller.AppController,
            _healthcontroller.HealthController
        ],
        providers: [
            {
                provide: _core.APP_INTERCEPTOR,
                useClass: _prometheusinterceptor.PrometheusInterceptor
            },
            {
                provide: _core.APP_INTERCEPTOR,
                scope: _common.Scope.REQUEST,
                useClass: _logginginterceptor.LoggingInterceptor
            },
            ...process.env.ENABLE_PROFILING === 'true' ? [
                {
                    provide: _core.APP_INTERCEPTOR,
                    useClass: _profilingInterceptor.ProfilingInterceptor
                }
            ] : []
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map