import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('journals')
export class Journals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    title: string;

    @Column()
    distance: number;

    @Column()
    calories: number;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column()
    duration: number;

    @Column({ name: 'route_image_url' })
    routeImageUrl: string;

    @Column({ nullable: true })
    memo: string;

    constructor(entityData: Partial<Journals>) {
        Object.assign(this, entityData);
    }
}
