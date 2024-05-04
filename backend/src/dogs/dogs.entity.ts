import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { DogWalkDay } from '../dog-walk-day/dog-walk-day.entity';
import { Breed } from '../breed/breed.entity';
import { Gender } from './dogs-gender.enum';
import { DailyWalkTime } from '../daily-walk-time/daily-walk-time.entity';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay, { nullable: false })
    @JoinColumn({ name: 'walk_day_id' })
    walkDay: DogWalkDay;

    @Column({ name: 'walk_day_id' })
    walkDayId: number;

    @OneToOne(() => DailyWalkTime, { nullable: false })
    @JoinColumn({ name: 'daily_walk_time_id' })
    dailyWalkTime: DailyWalkTime;

    @Column({ name: 'daily_walk_time_id' })
    dailyWalkTimeId: number;

    @Column()
    name: string;

    @ManyToOne(() => Breed, { nullable: false })
    @JoinColumn({ name: 'breed_id' })
    breed: Breed;

    @Column({ name: 'breed_id' })
    breedId: number;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    gender: 'MALE' | 'FEMALE';

    @Column()
    birth: Date;

    @Column({ name: 'is_neutered' })
    isNeutered: boolean;

    @Column({ name: 'photo_url' })
    photoUrl: string;

    @Column({ name: 'is_walking' })
    isWalking: boolean;
}
