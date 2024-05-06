import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dogs } from '../dogs/dogs.entity';
import { Users } from './users.entity';

@Entity('users_dogs')
export class UsersDogs {
    @PrimaryColumn({ name: 'user_id' })
    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dogId: number;
}
