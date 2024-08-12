import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
interface ClassConstructor {
    new (...args: any[]): object;
}
export declare class SerializeInterceptor implements NestInterceptor {
    private readonly dto;
    constructor(dto: ClassConstructor);
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>;
}
export declare function Serialize(dto: any): MethodDecorator & ClassDecorator;
export {};
