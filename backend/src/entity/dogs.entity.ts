import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { DogWalkDay } from './dogWalkDay.entity';
import { Breed } from './breed.entity';
import { Gender } from './dogs-gender.enum';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay)
    @JoinColumn({ name: 'walk_day_id' })
    private walkDayId: DogWalkDay;

    @Column()
    private name: string;

    @OneToOne(() => Breed)
    @JoinColumn({ name: 'breed_id' })
    private breedId: Breed;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    private gender: 'MALE' | 'FEMALE';

    @Column()
    private birth: Date;

    @Column({ name: 'is_neutered' })
    private isNeutered: boolean;

    @Column({ name: 'photo_url' })
    private photoUrl: string;

    @Column({ name: 'is_walking' })
    private isWalking: boolean;
}
