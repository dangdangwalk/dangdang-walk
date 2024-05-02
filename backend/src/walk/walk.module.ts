import { Module } from '@nestjs/common';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';
import { DogsService } from 'src/dogs/dogs.service';
import { DogsModule } from 'src/dogs/dogs.module';

@Module({
    imports: [DogsModule],
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
