import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AccessTokenPayload } from '../auth/token/token.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserProfile(user: AccessTokenPayload): Promise<import('./types/user-profile.type').UserProfile>;
    updateUserProfile({ userId }: AccessTokenPayload, userInfo: UpdateUserDto): Promise<void>;
}
