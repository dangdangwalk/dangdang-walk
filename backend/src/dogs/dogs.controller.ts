import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { In } from 'typeorm';
import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { UsersService } from '../users/users.service';
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
    async delete(@Param('id', ParseIntPipe) dogId: number) {
        await this.dogsService.deleteDogFromUser({ id: dogId });

        return true;
    }

    @Patch('/:id')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async update(@Param('id', ParseIntPipe) dogId: number, @Body() dogDto: DogDto) {
        await this.dogsService.updateDog(dogId, dogDto);

        return true;
    }

    @Get('/walk-available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogProfile[]> {
        const ownDogIds = await this.usersService.getOwnDogsList(userId);
        return await this.dogsService.getProfileList({ id: In(ownDogIds), isWalking: false });
    }

    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        const res = await this.dogsService.getDogsStatistics(userId);
        return res;
    }

    @Get('/:id')
    @UseGuards(AuthDogGuard)
    async getOneProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }
}
