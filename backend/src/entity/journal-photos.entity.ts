import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Journals } from '../journals/journals.entity';

@Entity('journal_photos')
export class JournalPhotos {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @Column({ name: 'photo_url' })
    photoUrl: string;
}
