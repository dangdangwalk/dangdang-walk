import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';
import { ExcrementsType } from './types/excrements.enum';

@Entity('excrements')
export class Excrements {
    @PrimaryColumn({ name: 'journal_id' })
    @ManyToOne(() => Journals, (WalkJournals) => WalkJournals.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dog_id' })
    dogId: number;

    @PrimaryColumn({ name: 'type', type: 'enum', enum: ExcrementsType })
    type: ExcrementsType;

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: string;

    constructor(entityData: Partial<Excrements>) {
        Object.assign(this, entityData);
    }
}
