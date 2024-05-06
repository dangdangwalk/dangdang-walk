import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { EntityManager, Repository } from 'typeorm';
import { DogWalkDay } from './dog-walk-day.entity';

@Injectable()
export class DogWalkDayRepository extends AbstractRepository<DogWalkDay> {
    constructor(
        @InjectRepository(DogWalkDay)
        dogWalkDayRepository: Repository<DogWalkDay>,
        entityManager: EntityManager
    ) {
        super(dogWalkDayRepository, entityManager);
    }
}
