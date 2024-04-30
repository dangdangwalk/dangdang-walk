import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../users/users.entity';
import { Dogs } from './dogs.entity';

@Entity('users_dogs')
export class UsersDogs {
    @PrimaryColumn()
    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user_id: Users;

    @PrimaryColumn()
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    dog_id: Dogs;
}
