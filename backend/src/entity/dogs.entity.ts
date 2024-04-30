import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { DogWalkDay } from './dogWalkDay.entity';
import { Breed } from './breed.entity';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay)
    @JoinColumn({ name: 'walk_day_id' })
    walkDayId: DogWalkDay;

    @Column()
    name: string;

    @OneToOne(() => Breed)
    @JoinColumn({ name: 'breed_id' })
    breedId: Breed;

    @Column({
        type: 'enum',
        enum: ['MALE', 'FEMALE'],
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
