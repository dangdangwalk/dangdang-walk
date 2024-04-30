import { IsIn, IsNumber } from 'class-validator';
import { Role } from '../user-roles.enum';

export class CheckMemberDto {
    @IsNumber()
    userId: number;

    @IsIn([Role.Admin, Role.User, undefined])
    role?: Role;
}
