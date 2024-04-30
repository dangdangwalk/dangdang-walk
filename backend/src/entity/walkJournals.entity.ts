import { User } from '../users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walk_journals')
export class WalkJournals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    private userId: User;

    @Column({ name: 'log_image_url' })
    private logImageUrl: string;

    @Column()
    private calories: number;

    @Column({ nullable: true })
    private memo: string;

    @Column({ name: 'started_at' })
    private startedAt: Date;

    @Column()
    private duration: string;

    @Column()
    private distance: number;
}
