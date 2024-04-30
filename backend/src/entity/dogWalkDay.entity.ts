import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dog_walk_day')
export class DogWalkDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    mon: number;

    @Column({ nullable: true })
    tue: number;

    @Column({ nullable: true })
    wed: number;

    @Column({ nullable: true })
    thr: number;

    @Column({ nullable: true })
    fri: number;

    @Column({ nullable: true })
    sat: number;

    @Column({ nullable: true })
    sun: number;
}
