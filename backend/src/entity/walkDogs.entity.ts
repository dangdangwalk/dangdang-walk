import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dogs } from './dogs.entity';
import { WalkJournals } from './walkJournals.entity';

@Entity('walk_dogs')
export class WalkDogs {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => WalkJournals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: WalkJournals;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dogId: Dogs;
}
