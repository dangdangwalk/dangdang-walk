import { Module } from '@nestjs/common';
import { JournalsDogsService } from './journals-dogs.service';

@Module({
  providers: [JournalsDogsService]
})
export class JournalsDogsModule {}
