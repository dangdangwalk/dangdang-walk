import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Excrements } from 'src/excrements/excrements.entity';
import { EntityManager, Repository } from 'typeorm';

export class ExcrementsRepository extends AbstractRepository<Excrements> {
    constructor(
        @InjectRepository(Excrements) excrementsRepository: Repository<Excrements>,
        entityManager: EntityManager
    ) {
        super(excrementsRepository, entityManager);
    }
}
