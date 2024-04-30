import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breed')
export class Breed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    private name: string;

    @Column()
    private activity: number;
}
