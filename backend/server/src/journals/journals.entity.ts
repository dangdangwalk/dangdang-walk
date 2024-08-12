import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from '../users/users.entity';

@Entity('journals')
@Index(['userId', 'startedAt'])
export class Journals {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (users) => users.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    distance: number;

    @Column()
    calories: number;

    @Column({ name: 'started_at' })
    startedAt: Date;

    @Column()
    duration: number;

    @Column({ name: 'journal_photos' })
    journalPhotos: string;

    @Column({ type: 'text' })
    routes: string;

    @Column({ nullable: true })
    memo: string;

    @Column({ name: 'excrement_count' })
    excrementCount: string;

    constructor(entityData: Partial<Journals>) {
        Object.assign(this, entityData);
    }
}
