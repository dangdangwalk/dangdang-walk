import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogs } from './dogs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Dogs])],
    providers: [DogService],
    exports: [TypeOrmModule, DogService],
})
export class DogModule {}
