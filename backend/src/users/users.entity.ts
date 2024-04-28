import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export enum Role {
    Admin = 'ADMIN',
    User = 'USER',
}

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    // @Column()
    // nickname: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @CreateDateColumn()
    created_at: Date;
}
