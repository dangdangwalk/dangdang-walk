import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { JournalsDogs } from './journals-dogs.entity';
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
