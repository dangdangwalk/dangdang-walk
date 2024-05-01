import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @ManyToOne(() => Dogs)
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
    createdAt: Date;

    constructor() {}

    static create(
        id: number,
        nickname: string,
        role: Role,
        mainDogId: number,
        oauthId: string,
        oauthAccessToken: string,
        oauthRefreshToken: string,
        refreshToken: string,
        createAt: Date
    ) {
        const user = new Users();
        user.id = id;
        user.nickname = nickname;
        user.role = role;
        user.mainDogId = mainDogId;
        user.oauthId = oauthId;
        user.oauthAccessToken = oauthAccessToken;
        user.oauthRefreshToken = oauthRefreshToken;
        user.refreshToken = refreshToken;
        user.createdAt = createAt;
        return user;
    }
}
