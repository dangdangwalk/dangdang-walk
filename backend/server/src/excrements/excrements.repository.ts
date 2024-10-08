import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Excrements } from './excrements.entity';

import { TypeORMRepository } from '../common/database/typeorm.repository';

export class ExcrementsRepository extends TypeORMRepository<Excrements> {
    constructor(
        @InjectRepository(Excrements) excrementsRepository: Repository<Excrements>,
        entityManager: EntityManager,
    ) {
        super(excrementsRepository, entityManager);
    }
}
