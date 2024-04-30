import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breed')
export class Excrements {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    activity: number;
}
