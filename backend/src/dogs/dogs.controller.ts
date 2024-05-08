import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/token/token.service';
import { Serialize } from 'src/common/interceptor/serialize.interceptor';
import { User } from 'src/users/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';
import { DogsService } from './dogs.service';
import { DogStatisticDto } from './dto/dog-statistic.dto';
import { DogDto } from './dto/dog.dto';
import { AuthDogGuard } from './guards/authDog.guard';

export type DogProfile = {
    id: number;
    name: string;
    photoUrl: string;
};

@Controller('dogs')
export class DogsController {
    constructor(
        private readonly usersService: UsersService,
        private readonly dogsService: DogsService
    ) {}

    @Post()
    async register(@User() { userId }: AccessTokenPayload, @Body() dogDto: DogDto) {
        await this.dogsService.createDogToUser(userId, dogDto);

        return true;
    }

    @Delete('/:id')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async delete(@User() { userId }: AccessTokenPayload, @Param('id', ParseIntPipe) dogId: number) {
        await this.dogsService.deleteDogFromUser(userId, { id: dogId });

        return true;
    }

    @Patch('/:id')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async update(@Param('id', ParseIntPipe) dogId: number, @Body() dogDto: DogDto) {
        await this.dogsService.updateDog(dogId, dogDto);

        return true;
    }

    @Get('/:id')
    @UseGuards(AuthDogGuard)
    async getOneProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }

    @Get('/walk-available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogProfile[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        return await this.dogsService.getProfileList({ id: In(ownDogIds), isWalking: false });
    }

    @Serialize(DogStatisticDto)
    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        return this.dogsService.getDogsStatistics(userId);
    }
}
