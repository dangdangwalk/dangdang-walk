import * as fs from 'node:fs';

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfilingInterceptor implements NestInterceptor {
    constructor(@Inject(getDataSourceToken()) private readonly dataSource: DataSource) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const originUrl = context.switchToHttp().getRequest().url.toString();
        const method = context.switchToHttp().getRequest().method.toString();

        await this.dataSource.query('SET profiling = 1');

        const now = Date.now();

        return next.handle().pipe(
            tap(async () => {
                const duration = Date.now() - now;

                const profiles = await this.dataSource.query('SHOW PROFILES');
                const profileDetailsPromises = profiles.map((profile: any) =>
                    this.dataSource.query(`SHOW PROFILE FOR QUERY ${profile.Query_ID}`),
                );
                const profileDetails = await Promise.all(profileDetailsPromises);

                fs.appendFileSync(
                    'log/query-profiling.log',
                    `>> ${method} ${originUrl}\nAPI Call Duration: ${duration}ms\nProfiles: ${JSON.stringify(profiles, null, 2)}\nDetails: ${JSON.stringify(profileDetails, null, 2)}\n\n`,
                );

                await this.dataSource.query('SET profiling = 0');
            }),
        );
    }
}
