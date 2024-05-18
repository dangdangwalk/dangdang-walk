import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Breed } from '../breed/breed.entity';
import { TodayWalkTime } from '../daily-walk-time/daily-walk-time.entity';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { Gender } from './dogs-gender.enum';

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
        enum: Gender,
    })
    gender: 'MALE' | 'FEMALE';

    @Column({ nullable: true, type: 'timestamp', default: null })
    birth: Date | null;

    @Column({ name: 'is_neutered' })
    isNeutered: boolean;

    @Column({ name: 'profile_photo_url', type: 'varchar', nullable: true, default: null })
    profilePhotoUrl: string | null;

    @Column({ name: 'is_walking', default: false })
    isWalking: boolean;

    constructor(entityData: Partial<Dogs>) {
        Object.assign(this, entityData);
    }
}
