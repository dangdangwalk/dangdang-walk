import { User } from '../users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walk_journals')
export class WalkJournals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    userId: User;

    @Column({ name: 'log_image_url' })
    logImageUrl: string;

    @Column()
    calories: number;

    @Column({ nullable: true })
    memo: string;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column()
    duration: string;

    @Column()
    distance: number;
}
