import { Module } from '@nestjs/common';

import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';

import { JournalsModule } from '../journals/journals.module';

@Module({
    imports: [JournalsModule],
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
