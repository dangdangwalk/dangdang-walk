import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthDogGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const dogId = this.getDogId(request);

        await this.checkDogOwnership(userId, dogId);

        return true;
    }

    private getDogId(request: any): number {
        const id = request.query.dogId || request.params.id;

        if (!this.isInt(id)) {
            throw new BadRequestException('dogId가 정수가 아닙니다', { cause: { id } });
        }

        return parseInt(id);
    }

    private async checkDogOwnership(userId: number, dogId: number): Promise<void> {
        const [owned] = await this.usersService.checkDogOwnership(userId, dogId);

        if (!owned) {
            throw new ForbiddenException(`유저 ${userId}은/는 강아지${dogId}의 주인이 아닙니다`);
        }
    }

    private isInt(value: any): boolean {
        const regex = /^\d+$/;
        return regex.test(value);
    }
}
