import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  refreshToken: string;

  @Column()
  tokenExpirationTime: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: string,
    refreshToken: string,
    tokenExpirationTime: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.refreshToken = refreshToken;
    this.tokenExpirationTime = tokenExpirationTime;
  }

  static createMember(user: User): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.refreshToken,
      user.tokenExpirationTime,
    );
  }
}
