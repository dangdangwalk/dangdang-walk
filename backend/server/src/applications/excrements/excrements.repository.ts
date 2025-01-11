import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMRepository } from 'shared/database/typeorm.repository';
import { EntityManager, Repository } from 'typeorm';

import { Excrements } from './excrements.entity';

export class ExcrementsRepository extends TypeORMRepository<Excrements> {
    constructor(
        @InjectRepository(Excrements) excrementsRepository: Repository<Excrements>,
        entityManager: EntityManager,
    ) {
        super(excrementsRepository, entityManager);
    }
}
