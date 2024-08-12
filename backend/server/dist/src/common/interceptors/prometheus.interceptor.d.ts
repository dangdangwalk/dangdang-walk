import { CallHandler, ExecutionContext, NestInterceptor, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class PrometheusInterceptor implements NestInterceptor, OnModuleInit {
    onModuleInit(): void;
    private readonly requestSuccessHistogram;
    private readonly requestFailHistogram;
    private readonly failureCounter;
    static registerServiceInfo(serviceInfo: { domain: string; name: string; version: string }): PrometheusInterceptor;
    private isAvailableMetricsUrl;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
