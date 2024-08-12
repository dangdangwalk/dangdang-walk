import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { GENDER, Gender } from './types/dogs.type';

import { Breed } from '../breed/breed.entity';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { TodayWalkTime } from '../today-walk-time/today-walk-time.entity';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay, { nullable: false, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'walk_day_id' })
    walkDay: DogWalkDay;

    @Column({ name: 'walk_day_id' })
    walkDayId: number;

    @OneToOne(() => TodayWalkTime, { nullable: false, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'today_walk_time_id' })
    todayWalkTime: TodayWalkTime;

    @Column({ name: 'today_walk_time_id' })
    todayWalkTimeId: number;

    @Column()
    name: string;

    @ManyToOne(() => Breed, { nullable: false, eager: true })
    @JoinColumn({ name: 'breed_id' })
    breed: Breed;

    @Column({ name: 'breed_id' })
    breedId: number;

    @Column({
        type: 'enum',
        enum: GENDER,
    })
    gender: Gender;

    @Column({ nullable: true, type: 'date', default: null })
    birth: string | null;

    @Column({ name: 'is_neutered' })
    isNeutered: boolean;

    @Column({ name: 'weight' })
    weight: number;

    @Column({ name: 'profile_photo_url', type: 'varchar', nullable: true, default: null })
    profilePhotoUrl: string | null;

    @Column({ name: 'is_walking', default: false })
    isWalking: boolean;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(entityData: Partial<Dogs>) {
        Object.assign(this, entityData);
    }
}
