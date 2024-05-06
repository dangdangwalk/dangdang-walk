import { Module } from '@nestjs/common';
import { DogsModule } from 'src/dogs/dogs.module';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';

@Module({
    imports: [DogsModule],
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
