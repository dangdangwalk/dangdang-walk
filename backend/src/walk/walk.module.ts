import { Module } from '@nestjs/common';
import { JournalsModule } from '../journals/journals.module';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';

@Module({
    imports: [JournalsModule],
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
