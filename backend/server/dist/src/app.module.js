"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
const database_module_1 = require("./common/database/database.module");
const health_controller_1 = require("./common/health/health.controller");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const profilingInterceptor_1 = require("./common/interceptors/profilingInterceptor");
const prometheus_interceptor_1 = require("./common/interceptors/prometheus.interceptor");
const winstonLogger_module_1 = require("./common/logger/winstonLogger.module");
const statistics_module_1 = require("./statistics/statistics.module");
const walk_module_1 = require("./walk/walk.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            winstonLogger_module_1.WinstonLoggerModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
            }),
            nestjs_prometheus_1.PrometheusModule.register({
                path: '/metrics',
                defaultMetrics: {
                    enabled: true,
                },
            }),
            auth_module_1.AuthModule,
            statistics_module_1.StatisticsModule,
            walk_module_1.WalkModule,
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: prometheus_interceptor_1.PrometheusInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                scope: common_1.Scope.REQUEST,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            ...(process.env.ENABLE_PROFILING === 'true'
                ? [
                    {
                        provide: core_1.APP_INTERCEPTOR,
                        useClass: profilingInterceptor_1.ProfilingInterceptor,
                    },
                ]
                : []),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map