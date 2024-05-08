import { BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('daily_walk_time')
export class DailyWalkTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    duration: number;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeUpdate()
    setUpdatedAtBeforeUpdate() {
        this.updatedAt = new Date();
    }
}
