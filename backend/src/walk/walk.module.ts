import { Module } from '@nestjs/common';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';
import { DogsService } from 'src/dog/dogs.service';
import { DogsModule } from 'src/dog/dogs.module';

@Module({
    imports: [DogsModule],
    controllers: [WalkController],
    providers: [WalkService, DogsService],
})
export class WalkModule {}
