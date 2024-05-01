import { Module } from '@nestjs/common';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';
import { DogService } from 'src/dog/dog.service';
import { DogModule } from 'src/dog/dog.module';

@Module({
    imports: [DogModule],
    controllers: [WalkController],
    providers: [WalkService, DogService],
})
export class WalkModule {}
