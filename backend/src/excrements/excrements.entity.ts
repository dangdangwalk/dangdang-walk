import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EXCREMENT, Excrement } from './types/excrement.type';

import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';

@Entity('excrements')
export class Excrements {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Journals, (WalkJournals) => WalkJournals.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journal_id' })
    journal: Journals;

    @Column({ name: 'journal_id' })
    journalId: number;

    @ManyToOne(() => Dogs, (dog) => dog.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dog_id' })
    dog: Dogs;

    @Column({ name: 'dog_id' })
    dogId: number;

    @Column({ name: 'type', type: 'enum', enum: EXCREMENT })
    type: Excrement;

    @Column({ type: 'point', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: string;

    constructor(entityData: Partial<Excrements>) {
        Object.assign(this, entityData);
    }
}
