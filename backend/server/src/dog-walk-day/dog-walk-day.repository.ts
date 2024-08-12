import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { DogWalkDay } from './dog-walk-day.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

@Injectable()
export class DogWalkDayRepository extends AbstractRepository<DogWalkDay> {
    constructor(
        @InjectRepository(DogWalkDay)
        dogWalkDayRepository: Repository<DogWalkDay>,
        entityManager: EntityManager,
    ) {
        super(dogWalkDayRepository, entityManager);
    }
}
