import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dog_walk_day')
export class DogWalkDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mon: number;

    @Column()
    tue: number;

    @Column()
    wed: number;

    @Column()
    thr: number;

    @Column()
    fri: number;

    @Column()
    sat: number;

    @Column()
    sun: number;
}
