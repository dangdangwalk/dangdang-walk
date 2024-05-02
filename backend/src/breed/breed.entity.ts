import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breed')
export class Breed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    activity: number;
}
