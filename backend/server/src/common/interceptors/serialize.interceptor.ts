import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
    new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private readonly dto: ClassConstructor) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}
