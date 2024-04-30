import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walk_log_photos')
export class WalkLogPhotos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo_url: string;
}
