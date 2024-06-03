import { CallHandler, ExecutionContext, Injectable, NestInterceptor, OnModuleInit } from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor, OnModuleInit {
    onModuleInit() {
        this.requestSuccessHistogram.reset();
        this.requestFailHistogram.reset();
        this.failureCounter.reset();
    }

    private readonly requestSuccessHistogram = new Histogram({
        name: 'nestjs_success_requests',
        help: 'NestJs success requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });

    private readonly requestFailHistogram = new Histogram({
        name: 'nestjs_fail_requests',
        help: 'NestJs fail requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });

    private readonly failureCounter = new Counter({
        name: 'nestjs_requests_failed_count',
        help: 'NestJs requests that failed',
        labelNames: ['handler', 'controller', 'error', 'method'],
    });

    static registerServiceInfo(serviceInfo: { domain: string; name: string; version: string }): PrometheusInterceptor {
        new Gauge({
            name: 'nestjs_info',
            help: 'NestJs service version info',
            labelNames: ['domain', 'name', 'version'],
        }).set(
            {
                domain: serviceInfo.domain,
                name: `${serviceInfo.domain}.${serviceInfo.name}`,
                version: serviceInfo.version,
            },
            1,
        );

        return new PrometheusInterceptor();
    }

    private isAvailableMetricsUrl(url: string): boolean {
        const excludePaths = 'metrics';
        if (url.includes(excludePaths)) {
            return false;
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
            return next.handle().pipe(
                tap({
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
                }),
            );
        } catch (error) {}
    }
}
