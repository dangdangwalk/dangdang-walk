import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from './journals.entity';

@Entity('journals_dogs')
export class JournalsDogs {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dog_id' })
    dogId: number;
}
