import { Injectable } from '@nestjs/common';
import { JournalsDogs } from 'src/journals/journals-dogs.entity';
import { FindOptionsWhere } from 'typeorm';
import { JournalsDogsRepository } from './journals-dogs.repository';

@Injectable()
export class JournalsDogsService {
    constructor(private readonly journalsDogsRepository: JournalsDogsRepository) {}

    async findOne(where: FindOptionsWhere<JournalsDogs>): Promise<JournalsDogs> {
        return this.journalsDogsRepository.findOne(where);
    }

    async find(where: FindOptionsWhere<JournalsDogs>): Promise<JournalsDogs[]> {
        return this.journalsDogsRepository.find(where);
    }
}
