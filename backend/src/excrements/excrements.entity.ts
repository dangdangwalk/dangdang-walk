import { Column, Entity, JoinColumn, ManyToOne, Point, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';

@Entity('excrements')
export class Excrements {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (WalkJournals) => WalkJournals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dog_id' })
    dogId: number;

    @Column({ name: '' })
    @Column({
        type: 'enum',
        enum: ['FECES', 'URINE'],
    })
    type: 'FECES' | 'URINE';

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: Point;

    constructor(entityData: Partial<Excrements>) {
        Object.assign(this, entityData);
    }
}
