import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    // @Column({
    //     name: 'updated_at',
    //     type: 'timestamp',
    //     default: () => 'CURRENT_TIMESTAMP(6)',
    //     onUpdate: 'CURRENT_TIMESTAMP(6)',
    // })
    // updatedAt: Date;
}
