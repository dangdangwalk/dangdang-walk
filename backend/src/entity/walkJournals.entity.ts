import { Users } from '../users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walk_journals')
export class WalkJournals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    user_id: Users;

    @Column()
    log_image_url: string;

    @Column()
    calories: number;

    @Column()
    memo: string;

    @Column()
    started_at: Date;

    @Column()
    duration: string;

    @Column()
    distance: number;
}
