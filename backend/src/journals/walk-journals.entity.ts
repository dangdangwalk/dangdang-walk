import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('walk_journals')
export class WalkJournals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    title: string;

    @Column({ name: 'log_image_url' })
    logImageUrl: string;

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

    constructor(entityData: Partial<WalkJournals>) {
        Object.assign(this, entityData);
    }
}
