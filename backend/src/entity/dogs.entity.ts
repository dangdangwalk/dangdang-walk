import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { DogWalkDay } from './dogWalkDay.entity';
import { Breed } from './breed.entity';

@Entity('dogs')
export class Dogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DogWalkDay)
    @JoinColumn({ name: 'walk_day_id' })
    walk_day_id: DogWalkDay;

    @Column()
    name: string;

    @OneToOne(() => Breed)
    @JoinColumn({ name: 'breed_id' })
    breed_id: Breed;

    @Column({
        type: 'enum',
        enum: ['MALE', 'FEMALE'],
    })
    gender: 'MALE' | 'FEMALE';

    @Column()
    birth: Date;

    @Column()
    is_neutered: boolean;

    @Column()
    photo_url: string;

    @Column()
    is_walking: boolean;
}
