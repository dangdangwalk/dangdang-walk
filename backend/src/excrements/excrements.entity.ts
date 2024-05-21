import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';
import { ExcrementsType } from './types/excrements.enum';

@Entity('excrements')
export class Excrements {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Journals, (WalkJournals) => WalkJournals.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @ManyToOne(() => Dogs, (dog) => dog.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dog_id' })
    dogId: number;

    @Column({ name: 'type', type: 'enum', enum: ExcrementsType })
    type: ExcrementsType;

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: string;

    constructor(entityData: Partial<Excrements>) {
        Object.assign(this, entityData);
    }
}
