import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../users/users.entity';
import { Dogs } from './dogs.entity';

@Entity('users_dogs')
export class UsersDogs {
    @PrimaryColumn({ name: 'user_id' })
    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: 'user_id' })
    private userId: Users;

    @PrimaryColumn({ name: 'dog_id' })
    @ManyToOne(() => Dogs, (dog) => dog.id)
    @JoinColumn({ name: 'dog_id' })
    private dogId: Dogs;
}
