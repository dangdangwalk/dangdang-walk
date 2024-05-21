import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('today_walk_time')
export class TodayWalkTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    duration: number;

    // @UpdateDateColumn({
    //     name: 'updated_at',
    //     type: 'timestamp',
    //     default: () => 'CURRENT_TIMESTAMP',
    //     onUpdate: 'CURRENT_TIMESTAMP',
    // })
    // updatedAt: Date;

    // @BeforeUpdate()
    // setUpdatedAtBeforeUpdate() {
    //     this.updatedAt = new Date();
    // }
}
