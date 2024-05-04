import { Injectable } from '@nestjs/common';
import { WalkJournalsRepository } from './walk-jorunals.repository';
import { WalkJournals } from './walk-journals.entity';
import { DeleteResult, FindOptionsWhere } from 'typeorm';

@Injectable()
export class JournalsService {
    constructor(private readonly walkJorunalsRepository: WalkJournalsRepository) {}

    async create() {
        const walkJournals = new WalkJournals({
            userId: 1,
            title: '일지 제목',
            logImageUrl: 'https://www.abc.com',
            calories: 200,
            memo: 'abcde',
            startedAt: new Date(),
            duration: 2000,
            distance: 300,
        });
        return this.walkJorunalsRepository.create(walkJournals);
    }

    async find(where: FindOptionsWhere<WalkJournals>) {
        return this.walkJorunalsRepository.find(where);
    }

    async delete(where: FindOptionsWhere<WalkJournals>): Promise<DeleteResult> {
        return this.walkJorunalsRepository.delete(where);
    }

    async findOne(where: FindOptionsWhere<WalkJournals>): Promise<WalkJournals> {
        return await this.walkJorunalsRepository.findOne(where);
    }
}
