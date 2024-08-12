import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { WinstonLoggerService } from '../../common/logger/winstonLogger.service';
import { UsersService } from '../../users/users.service';
import { isTypedArray } from '../../utils/validator.util';

@Injectable()
export class AuthDogsGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: WinstonLoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogIds: number[] = this.getDogIds(request);

        await this.checkDogOwnership(userId, dogIds);

        return true;
    }

    private getDogIds(request: any): number[] {
        const body = request.body.dogs || request.body;

        if (!isTypedArray(body, 'number')) {
            const error = new BadRequestException('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다');
            this.logger.error('유효하지 않은 request body: dogIds가 number 타입의 배열이 아닙니다', {
                trace: error.stack ?? 'No stack',
            });
            throw error;
        }

        return body;
    }

    private async checkDogOwnership(userId: number, dogIds: number[]): Promise<void> {
        const [owned, notFoundDogIds] = await this.usersService.checkDogOwnership(userId, dogIds);

        if (!owned) {
            const error = new ForbiddenException(
                `유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`,
            );
            this.logger.error(
                `유저 ${userId}은/는 다음 강아지(들)에 대한 접근 권한이 없습니다: ${notFoundDogIds.join(', ')}`,
                {
                    trace: error.stack ?? 'No stack',
                },
            );
            throw error;
        }
    }
}
