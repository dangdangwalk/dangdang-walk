import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { Role } from './user-roles.enum';

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @CreateDateColumn()
    created_at: Date;
}
