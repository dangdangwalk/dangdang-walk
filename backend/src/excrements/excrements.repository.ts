import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AbstractRepository } from '../common/database/abstract.repository';
import { Excrements } from '../excrements/excrements.entity';

export class ExcrementsRepository extends AbstractRepository<Excrements> {
    constructor(
        @InjectRepository(Excrements) excrementsRepository: Repository<Excrements>,
        entityManager: EntityManager,
    ) {
        super(excrementsRepository, entityManager);
    }
}
