import { Column, Entity, JoinColumn, ManyToOne, Point, PrimaryColumn } from 'typeorm';
import { WalkJournals } from './walkJournals.entity';
import { Dogs } from './dogs.entity';

@Entity('excrements')
export class Excrements {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => WalkJournals, (WalkJournals) => WalkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dogId: number;

    @Column({
        type: 'enum',
        enum: ['FECES', 'URINE'],
    })
    type: 'FECES' | 'URINE';

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: Point;
}
