import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Journals } from '../journals/journals.entity';

@Entity('journal_photos')
export class JournalPhotos {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Journals, (journals) => journals.id)
    @JoinColumn({ name: 'journal_id' })
    journalId: number;

    @Column()
    photoUrl: string;

    constructor(entityData: Partial<JournalPhotos>) {
        Object.assign(this, entityData);
    }
}
