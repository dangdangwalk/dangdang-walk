import { Module } from '@nestjs/common';
import { PrometheusModule as NestPrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        NestPrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
            },
        }),
    ],
})
export class PrometheusModule {}
