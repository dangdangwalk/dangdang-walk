import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Serialize } from '../common/interceptor/serialize.interceptor';
import { DogsService } from '../dogs/dogs.service';
import { WalkCommandDto } from './dtos/walk-command.dto';

@Controller('/walk')
@UsePipes(new ValidationPipe())
export class WalkController {
    constructor(private readonly dogService: DogsService) {}

    @Serialize(WalkCommandDto)
    @Post('/start')
    startWalk(@Body() body: WalkCommandDto): Promise<number[]> {
        const dogIds = [];
        for (const curId of body.dogId) {
            dogIds.push(parseInt(curId));
        }
        return this.dogService.updateIsWalking(dogIds, true);
    }

    @Serialize(WalkCommandDto)
    @Post('/stop')
    stopWalk(@Body() body: WalkCommandDto): Promise<number[]> {
        const dogIds = [];
        for (const curId of body.dogId) {
            dogIds.push(parseInt(curId));
        }
        return this.dogService.updateIsWalking(dogIds, false);
    }
}
