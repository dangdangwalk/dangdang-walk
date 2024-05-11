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

    @Column({ name: 'route_image_url' })
    routeImageUrl: string;

    @Column()
    calories: number;

    @Column({ nullable: true })
    memo: string;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column()
    duration: number;

    @Column()
    distance: number;

    constructor(entityData: Partial<Journals>) {
        Object.assign(this, entityData);
    }
}
