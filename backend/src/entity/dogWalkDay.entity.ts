import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dog_walk_day')
export class DogWalkDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    private mon: number;

    @Column({ default: 0 })
    private tue: number;

    @Column({ default: 0 })
    private wed: number;

    @Column({ default: 0 })
    private thr: number;

    @Column({ default: 0 })
    private fri: number;

    @Column({ default: 0 })
    private sat: number;

    @Column({ default: 0 })
    private sun: number;
}
