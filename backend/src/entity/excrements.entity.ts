import { Column, Entity, JoinColumn, ManyToOne, Point, PrimaryColumn } from 'typeorm';
import { walkJournals } from './walk_journals.entity';
import { Dogs } from './dogs.entity';

@Entity('excrements')
export class Excrements {
    @PrimaryColumn()
    @ManyToOne(() => walkJournals, (walkJournals) => walkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journal_id: number;

    @PrimaryColumn()
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dog_id: number;

    @Column({
        type: 'enum',
        enum: ['FECES', 'URINE'],
    })
    type: 'FECES' | 'URINE';

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: Point;
}
