import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMRepository } from 'shared/database/typeorm.repository';
import { EntityManager, Repository } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';

@Injectable()
export class DogWalkDayRepository extends TypeORMRepository<DogWalkDay> {
    constructor(
        @InjectRepository(DogWalkDay)
        dogWalkDayRepository: Repository<DogWalkDay>,
        entityManager: EntityManager,
    ) {
        super(dogWalkDayRepository, entityManager);
    }
}
