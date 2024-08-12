import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breed')
export class Breed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    koreanName: string;

    @Column()
    englishName: string;

    @Column()
    recommendedWalkAmount: number;
}
