import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('daily_walk_time')
export class DailyWalkTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    duration: number;

    @Column({ name: 'updated_at' })
    updatedAt: Date;
}
