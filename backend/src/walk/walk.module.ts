import { Module } from '@nestjs/common';
import { JournalsDogsModule } from 'src/journals-dogs/journals-dogs.module';
import { JournalsModule } from 'src/journals/journals.module';
import { UsersModule } from 'src/users/users.module';
import { DogsModule } from '../dogs/dogs.module';
import { WalkController } from './walk.controller';
import { WalkService } from './walk.service';

@Module({
    imports: [DogsModule, UsersModule, JournalsDogsModule, JournalsModule],
    controllers: [WalkController],
    providers: [WalkService],
})
export class WalkModule {}
