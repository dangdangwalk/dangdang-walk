import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('dog_walk_day')
export class DogWalkDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    mon: number;

    @Column({ default: 0 })
    tue: number;

    @Column({ default: 0 })
    wed: number;

    @Column({ default: 0 })
    thr: number;

    @Column({ default: 0 })
    fri: number;

    @Column({ default: 0 })
    sat: number;

    @Column({ default: 0 })
    sun: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(entityData: Partial<DogWalkDay>) {
        Object.assign(this, entityData);
    }

    [key: string]: number | Date;
}
