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

    @Get('/available-dogs')
    fakeAvailable() {
        const result = [];
        result.push({
            id: '1',
            name: 'dukji',
            photoUrl: 'http://www/fake.com',
        });
        result.push({
            id: '2',
            name: 'dangdang',
            photoUrl: 'http://www/fake2.com',
        });
        result.push({
            id: '3',
            name: '댕댕이',
            photoUrl: 'http://www/fake3.com',
        });
        result.push({
            id: '4',
            name: '깜지',
            photoUrl: 'http://www/fake4.com',
        });
        result.push({
            id: '5',
            name: '참깨',
            photoUrl: 'http://www/fake5.com',
        });

        return result;
    }

    @Post('/walk/start')
    fakeWalkStart() {
        const result = [1, 2, 3, 4, 5];
        return result;
    }

    @Delete('/walk/stop')
    fakeWalkStop() {
        const result = [1, 2, 3, 4, 5];
        return result;
    }

    @Post('/journals')
    fakeJournalsSave() {
        return true;
    }
}
