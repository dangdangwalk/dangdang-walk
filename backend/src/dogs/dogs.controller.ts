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
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { DogsService } from './dogs.service';
import { CreateDogDto } from './dtos/create-dog.dto';
import { UpdateDogDto } from './dtos/update-dog.dto';
import { AuthDogGuard } from './guards/auth-dog.guard';

import { User } from '../users/decorators/user.decorator';
import { AccessTokenPayload } from '../auth/token/token.service';

@Controller('/dogs')
@UsePipes(new ValidationPipe({ validateCustomDecorators: true, whitelist: true }))
export class DogsController {
    constructor(private readonly dogsService: DogsService) {}

    @Get()
    async getProfileList(@User() { userId }: AccessTokenPayload) {
        return this.dogsService.getProfileList(userId);
    }

    @Post()
    async create(@User() { userId }: AccessTokenPayload, @Body() createDogDto: CreateDogDto) {
        await this.dogsService.createDogToUser(userId, createDogDto);
        return true;
    }

    @Get('/:id(\\d+)')
    @UseGuards(AuthDogGuard)
    async getProfile(@Param('id', ParseIntPipe) dogId: number) {
        return this.dogsService.getProfile(dogId);
    }

    @Patch('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async update(
        @User() { userId }: AccessTokenPayload,
        @Param('id', ParseIntPipe) dogId: number,
        @Body() updateDogDto: UpdateDogDto,
    ) {
        await this.dogsService.updateDog(userId, dogId, updateDogDto);
        return true;
    }

    @Delete('/:id(\\d+)')
    @HttpCode(204)
    @UseGuards(AuthDogGuard)
    async delete(@User() { userId }: AccessTokenPayload, @Param('id', ParseIntPipe) dogId: number) {
        await this.dogsService.deleteDogFromUser(userId, dogId);
        return true;
    }
}
