import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { DogWalkDay } from '../entity/dog-walk-day.entity';
import { Breed } from '../entity/breed.entity';
import { Gender } from '../entity/dogs-gender.enum';
import { DailyWalkTime } from '../entity/daily-walk-time.entity';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay)
    @JoinColumn({ name: 'walk_day_id' })
    walkDayId: DogWalkDay;

    @OneToOne(() => DailyWalkTime)
    @JoinColumn({ name: 'daily_walk_time_id' })
    DailyWalkTimeId: number;

    @Column()
    name: string;

    @OneToOne(() => Breed)
    @JoinColumn({ name: 'breed_id' })
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
