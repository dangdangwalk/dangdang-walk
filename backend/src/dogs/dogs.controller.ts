import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { DogsService } from './dogs.service';
import { DogDto } from './dto/dog.dto';
import { AuthDogGuard } from './guards/authDog.guard';

export type DogProfile = {
    id: number;
    name: string;
    profilePhotoUrl: string;
};

@Controller('dogs')
export class DogsController {
    constructor(private readonly dogsService: DogsService) {}

    @Post()
    async register(@User() { userId }: AccessTokenPayload, @Body() dogDto: DogDto) {
        await this.dogsService.createDogToUser(userId, dogDto);

        return true;
    }

    @Delete('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async delete(@Param('id', ParseIntPipe) dogId: number) {
        await this.dogsService.deleteDogFromUser({ id: dogId });

        return true;
    }

    @Patch('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async update(@Param('id', ParseIntPipe) dogId: number, @Body() dogDto: DogDto) {
        await this.dogsService.updateDog(dogId, dogDto);

        return true;
    }

    @Get('/walk-available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogProfile[]> {
        return await this.dogsService.getAvailableDogs(userId);
    }
    @Get('/:id(\\d+)')
    @UseGuards(AuthDogGuard)
    async getOneProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }

    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        return await this.dogsService.getDogsStatistics(userId);
    }

    @Get('/breeds')
    async getBreedData() {
        //TODO : 데이터 확정 후에는 DB에서 가져오는걸로 바꾸기..
        return [
            {
                name: '말티즈',
                recommendedWalkAmount: 2000,
            },
            {
                name: '푸들',
                recommendedWalkAmount: 1800,
            },
            {
                name: '시바견',
                recommendedWalkAmount: 1600,
            },
            {
                name: '골든 리트리버',
                recommendedWalkAmount: 1700,
            },
            {
                name: '보더 콜리',
                recommendedWalkAmount: 1900,
            },
            {
                name: '사모예드',
                recommendedWalkAmount: 2200,
            },
            {
                name: '비글',
                recommendedWalkAmount: 1500,
            },
            {
                name: '닥스훈트',
                recommendedWalkAmount: 2100,
            },
            {
                name: '요크셔 테리어',
                recommendedWalkAmount: 1750,
            },
            {
                name: '치와와',
                recommendedWalkAmount: 1650,
            },
            {
                name: '보스턴 테리어',
                recommendedWalkAmount: 1850,
            },
            {
                name: '퍼그',
                recommendedWalkAmount: 2300,
            },
            {
                name: '허스키',
                recommendedWalkAmount: 1950,
            },
            {
                name: '록시',
                recommendedWalkAmount: 2100,
            },
            {
                name: '로트와일러',
                recommendedWalkAmount: 2200,
            },
            {
                name: '비숑 프리제',
                recommendedWalkAmount: 1700,
            },
            {
                name: '허밍턴',
                recommendedWalkAmount: 1800,
            },
            {
                name: '셰퍼드',
                recommendedWalkAmount: 1900,
            },
            {
                name: '웰시 코기',
                recommendedWalkAmount: 2000,
            },
            {
                name: '잉글리쉬 세터',
                recommendedWalkAmount: 1600,
            },
            {
                name: '아프간 하운드',
                recommendedWalkAmount: 1750,
            },
            {
                name: '블러드하운드',
                recommendedWalkAmount: 2300,
            },
            {
                name: '레브라도 리트리버',
                recommendedWalkAmount: 1500,
            },
            {
                name: '잭 러셀 테리어',
                recommendedWalkAmount: 2050,
            },
            {
                name: '베들링턴 테리어',
                recommendedWalkAmount: 1950,
            },
            {
                name: '토이 푸들',
                recommendedWalkAmount: 1850,
            },
            {
                name: '삽살개',
                recommendedWalkAmount: 2150,
            },
            {
                name: '콜리',
                recommendedWalkAmount: 2250,
            },
            {
                name: '말라뮤트',
                recommendedWalkAmount: 1700,
            },
        ];
    }
}
