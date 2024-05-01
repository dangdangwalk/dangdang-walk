import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './user-roles.enum';
import { Dogs } from 'src/dog/dogs.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nickname: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @OneToOne(() => Dogs)
    @JoinColumn({ name: 'main_dog_id' })
    mainDogId: number | null;

    @Column({ name: 'oauth_id' })
    oauthId: string;

    @Column({ name: 'oauth_access_token' })
    oauthAccessToken: string;

    @Column({ name: 'oauth_refresh_token' })
    oauthRefreshToken: string;

    @Column({ name: 'refresh_token' })
    refreshToken: string;

    @CreateDateColumn()
    created_at: Date;
}
