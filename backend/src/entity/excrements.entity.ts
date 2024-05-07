import { Column, Entity, JoinColumn, ManyToOne, Point, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';

@Entity('excrements')
export class Excrements {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (WalkJournals) => WalkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journal: Journals;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dog: Dogs;

    @Column({ name: '' })
    @Column({
        type: 'enum',
        enum: ['FECES', 'URINE'],
    })
    type: 'FECES' | 'URINE';

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: Point;
}
