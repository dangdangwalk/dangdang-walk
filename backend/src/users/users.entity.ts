import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
    Admin = 'Admin',
    User = 'User',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    nickname: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @Column()
    created_at: Date;
}
