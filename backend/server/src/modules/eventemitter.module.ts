import { Module } from '@nestjs/common';
import { EventEmitterModule as NestEventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [NestEventEmitterModule.forRoot()],
})
export class EventemitterModule {}
