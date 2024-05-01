import { Module } from '@nestjs/common';
import { HomeScreenController } from './home-screen.controller';
import { HomeScreenService } from './home-screen.service';

@Module({
  controllers: [HomeScreenController],
  providers: [HomeScreenService]
})
export class HomeScreenModule {}
