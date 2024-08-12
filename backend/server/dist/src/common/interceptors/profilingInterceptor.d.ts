import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
export declare class ProfilingInterceptor implements NestInterceptor {
    private readonly dataSource;
    private readonly configService;
    constructor(dataSource: DataSource, configService: ConfigService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logProfilingData;
    private initProfiling;
}
