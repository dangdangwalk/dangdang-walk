import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { WalkJournals } from '../journals/walk-journals.entity';

@Entity('walk_dogs')
export class WalkDogs {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => WalkJournals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dogId: number;
}
