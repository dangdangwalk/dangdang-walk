import { IsIn, IsString } from 'class-validator';
import { Role } from '../user-roles.enum';

export class IsMemberDto {
    @IsString()
    userId: string;

    @IsIn([Role.Admin, Role.User, undefined])
    role?: Role;
}
