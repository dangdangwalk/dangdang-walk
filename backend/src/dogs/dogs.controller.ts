import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AccessTokenPayload } from '../auth/token/token.service';
import { User } from '../users/decorators/user.decorator';
import { DogsService } from './dogs.service';
import { DogDto } from './dto/dog.dto';
import { AuthDogGuard } from './guards/authDog.guard';
import { DateValidationPipe } from './pipes/dateValidation.pipe';

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

    @Get('/:id(\\d+)')
    @UseGuards(AuthDogGuard)
    async getOneProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }

    @Get('/:id(\\d+)/statistics')
    @UseGuards(AuthDogGuard)
    async getDogStatistics(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Query('date', DateValidationPipe) date: string
    ) {
        return await this.dogsService.getDogStatistics(userId, dogId, date);
    }

    @Get('/statistics')
    async getDogsStatistics(@User() { userId }: AccessTokenPayload) {
        return await this.dogsService.getDogsStatistics(userId);
    }

    @Get('/walk-available')
    async getAvailableDogs(@User() { userId }: AccessTokenPayload): Promise<DogProfile[]> {
        return await this.dogsService.getAvailableDogs(userId);
    }
}
