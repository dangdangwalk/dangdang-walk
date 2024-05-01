import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { WalkJournals } from './walk-journals.entity';

@Entity('walk_log_photos')
export class WalkLogPhotos {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => WalkJournals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @Column({ name: 'photo_url' })
    photoUrl: string;
}
