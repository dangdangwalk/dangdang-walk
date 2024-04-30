import { Module } from '@nestjs/common';
import { FakeController } from './fake.controller';

@Module({
    controllers: [FakeController],
})
export class FakeModule {}
