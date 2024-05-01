import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller()
export class FakeController {
    @Get('/dogs/statistics')
    fakeStatistics() {
        const result = [];
        result.push({
            id: '1',
            name: 'dukji',
            photoUrl: 'http://www.fake.com',
            amountOfWalk: '3600', //1h
            dayWalkTime: '1800', //30m
            weeklyWalkCheck: [1, 0, 0, 1, 0, 1, 1],
        });
        result.push({
            id: '2',
            name: 'dangdang',
            photoUrl: 'http://www.fake2.com',
            amountOfWalk: '7200', //2h
            dayWalkTime: '2232', //37분 12초
            weeklyWalkCheck: [1, 0, 0, 1, 0, 1, 1],
        });
        return result;
    }

    @Post('/journals')
    fakeJournalsSave() {
        return true;
    }
}
