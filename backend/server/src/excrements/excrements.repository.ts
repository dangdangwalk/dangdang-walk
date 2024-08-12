import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Excrements } from './excrements.entity';

import { AbstractRepository } from '../common/database/abstract.repository';

export class ExcrementsRepository extends AbstractRepository<Excrements> {
    constructor(
        @InjectRepository(Excrements) excrementsRepository: Repository<Excrements>,
        entityManager: EntityManager,
    ) {
        super(excrementsRepository, entityManager);
    }
}
