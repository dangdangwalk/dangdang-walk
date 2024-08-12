"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrometheusInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusInterceptor = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const rxjs_1 = require("rxjs");
let PrometheusInterceptor = PrometheusInterceptor_1 = class PrometheusInterceptor {
    constructor() {
        this.requestSuccessHistogram = new prom_client_1.Histogram({
            name: 'nestjs_success_requests',
            help: 'NestJs success requests - duration in seconds',
            labelNames: ['handler', 'controller', 'method'],
            buckets: [0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
        });
        this.requestFailHistogram = new prom_client_1.Histogram({
            name: 'nestjs_fail_requests',
            help: 'NestJs fail requests - duration in seconds',
            labelNames: ['handler', 'controller', 'method'],
            buckets: [0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
        });
        this.failureCounter = new prom_client_1.Counter({
            name: 'nestjs_requests_failed_count',
            help: 'NestJs requests that failed',
            labelNames: ['handler', 'controller', 'error', 'method'],
        });
    }
    onModuleInit() {
        this.requestSuccessHistogram.reset();
        this.requestFailHistogram.reset();
        this.failureCounter.reset();
    }
    static registerServiceInfo(serviceInfo) {
        new prom_client_1.Gauge({
            name: 'nestjs_info',
            help: 'NestJs service version info',
            labelNames: ['domain', 'name', 'version'],
        }).set({
            domain: serviceInfo.domain,
            name: `${serviceInfo.domain}.${serviceInfo.name}`,
            version: serviceInfo.version,
        }, 1);
        return new PrometheusInterceptor_1();
    }
    isAvailableMetricsUrl(url) {
        const excludePaths = 'metrics';
        if (url.includes(excludePaths)) {
            return false;
        }
        return true;
    }
    intercept(context, next) {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();
        const labels = {
            controller: context.getClass().name,
            handler: context.getHandler().name,
            method: method,
        };
        try {
            const requestSuccessTimer = this.requestSuccessHistogram.startTimer(labels);
            const requestFailTimer = this.requestFailHistogram.startTimer(labels);
            return next.handle().pipe((0, rxjs_1.tap)({
                next: () => {
                    if (this.isAvailableMetricsUrl(originUrl)) {
                        requestSuccessTimer();
                    }
                },
                error: () => {
                    if (this.isAvailableMetricsUrl(originUrl)) {
                        requestFailTimer();
                        this.failureCounter.labels({ ...labels }).inc(1);
                    }
                },
            }));
        }
        catch (error) { }
    }
};
exports.PrometheusInterceptor = PrometheusInterceptor;
exports.PrometheusInterceptor = PrometheusInterceptor = PrometheusInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], PrometheusInterceptor);
//# sourceMappingURL=prometheus.interceptor.js.map