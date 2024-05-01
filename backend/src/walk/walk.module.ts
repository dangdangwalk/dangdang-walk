import { Module } from '@nestjs/common';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';

@Module({
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
