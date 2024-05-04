import { Controller, Get } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { WalkJournals } from './walk-journals.entity';

@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) {}
    @Get()
    async createJournal() {
        const createResult = await this.journalsService.create({
            userId: 1,
            title: '일지 제목',
            logImageUrl: 'https://www.abc.com',
            calories: 200,
            memo: 'abcde',
            startedAt: new Date(),
            duration: 2000,
            distance: 300,
        });
        console.log('createResult : ', createResult);
        const findResult = await this.journalsService.find({ id: createResult.id });
        console.log('findResult : ', findResult);
        const updateResult = await this.journalsService.update({ id: createResult.id }, { memo: '메모 수정' });
        console.log('updateResult : ', updateResult);
        const findOneResult = await this.journalsService.findOne({ id: createResult.id });
        console.log('findOne Result : ', findOneResult);
        const updateAndFindOneResult = await this.journalsService.updateAndFindOne({ id: createResult.id }, {
            memo: '메모 수정2',
        } as Partial<WalkJournals>);
        console.log('updateAndFindOne Result : ', updateAndFindOneResult);
        const deleteResult = await this.journalsService.delete({ id: createResult.id });
        console.log('deleteResult: ', deleteResult);
    }
}
