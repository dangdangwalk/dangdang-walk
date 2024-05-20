import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { Gender } from './dogs-gender.enum';
import { DogsService } from './dogs.service';
import { DogDto } from './dto/dog.dto';
import { AuthDogGuard } from './guards/authDog.guard';

export type DogProfile = {
    id: number;
    name: string;
    breed: string;
    gender: Gender;
    isNeutered: boolean;
    birth: Date | null;
    weight: number;
    profilePhotoUrl: string | null;
};

export type DogSummary = {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
};

@Controller('dogs')
export class DogsController {
    constructor(private readonly dogsService: DogsService) {}

    @Get()
    async getProfileList(@User() { userId }: AccessTokenPayload) {
        return this.dogsService.getProfileList(userId);
    }

    @Post()
    async register(@User() { userId }: AccessTokenPayload, @Body() dogDto: DogDto) {
        await this.dogsService.createDogToUser(userId, dogDto);
        return true;
    }

    @Delete('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async delete(@User() { userId }: AccessTokenPayload, @Param('id', ParseIntPipe) dogId: number) {
        await this.dogsService.deleteDogFromUser(userId, dogId);
        return true;
    }

    @Patch('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async update(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Body() dogDto: DogDto
    ) {
        await this.dogsService.updateDog(userId, dogId, dogDto);
        return true;
    }

    @Get('/:id(\\d+)')
    @UseGuards(AuthDogGuard)
    async getProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }
}
