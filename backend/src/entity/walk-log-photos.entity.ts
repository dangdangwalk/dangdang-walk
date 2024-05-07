import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Journals } from '../journals/journals.entity';

@Entity('walk_log_photos')
export class WalkLogPhotos {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @Column({ name: 'photo_url' })
    photoUrl: string;
}
