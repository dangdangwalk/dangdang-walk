import * as fs from 'node:fs';

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfilingInterceptor implements NestInterceptor {
    constructor(@Inject(getDataSourceToken()) private readonly dataSource: DataSource) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();

        return from(this.dataSource.query('SET profiling = 1')).pipe(
            switchMap(() => {
                const now = Date.now();
                return next.handle().pipe(
                    concatMap((result) =>
                        from(this.logProfilingData(method, originUrl, now)).pipe(
                            switchMap(() => from(this.dataSource.query('SET profiling = 0'))),
                            switchMap(() => from([result])),
                        ),
                    ),
                );
            }),
        );
    }

    private async logProfilingData(method: string, originUrl: string, startTime: number): Promise<void> {
        const duration = Date.now() - startTime;

        const profiles = await this.dataSource.query('SHOW PROFILES');
        const profileDetailsPromises = profiles.map((profile: any) =>
            this.dataSource.query(`SHOW PROFILE FOR QUERY ${profile.Query_ID}`),
        );
        const profileDetails = await Promise.all(profileDetailsPromises);
        const profilesWithDetails = profiles.map((profile: any, index: number) => ({
            ...profile,
            Details: profileDetails[index],
        }));

        fs.appendFileSync(
            'log/query-profiling.log',
            `>> ${method} ${originUrl}\nAPI Call Duration: ${duration}ms\nProfiles: ${JSON.stringify(profilesWithDetails, null, 2)}\n\n`,
        );
    }
}
