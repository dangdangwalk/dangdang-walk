import * as fs from 'node:fs';

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfilingInterceptor implements NestInterceptor {
    constructor(
        @Inject(getDataSourceToken()) private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();

        return from(this.initProfiling()).pipe(
            switchMap(() => {
                const now = Date.now();
                return next
                    .handle()
                    .pipe(
                        switchMap((result) =>
                            from(this.logProfilingData(method, originUrl, now)).pipe(map(() => result)),
                        ),
                    );
            }),
        );
    }

    private async logProfilingData(method: string, originUrl: string, startTime: number): Promise<void> {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toLocaleString();

        const profiles = await this.dataSource.query('SHOW PROFILES');
        const queryDurations = profiles.map((profile: any) => ({
            Query: profile.Query,
            Duration: profile.Duration,
        }));

        fs.appendFileSync(
            `log/query-profiling.${this.configService.get<string>('NODE_ENV')}.log`,
            `>> ${method} ${originUrl}\nTimestamp: ${timestamp}\nAPI Call Duration: ${duration}ms\nExecuted Queries: ${queryDurations.length}\nQueries: ${JSON.stringify(queryDurations, null, 2)}\n\n`,
        );
    }

    private async initProfiling(): Promise<void> {
        await this.dataSource.query('SET profiling_history_size = 0');
        await this.dataSource.query('SET profiling_history_size = 100');
        await this.dataSource.query('SET profiling = 1');
    }
}
