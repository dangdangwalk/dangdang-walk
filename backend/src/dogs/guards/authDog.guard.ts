import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthDogGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        const { id: dogId } = request.params; // Convert id to number

        const owned = await this.usersService.checkDogOwnership(userId, dogId);

        if (!owned) {
            throw new ForbiddenException('주인이 아닌 강아지에 대한 요청');
        }

        return true;
    }
}
