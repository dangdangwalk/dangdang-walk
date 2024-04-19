import { User } from './users.entity';

describe('UserEntity', () => {
  const users: User[] = [];

  beforeEach(() => {
    const user = {
      id: users.length + 1,
      name: '홍길동',
      email: 'abcd@gmail.com',
      password: 'MTIzNAo=',
      role: 'USER',
      refreshToken: 'YXNka2Fsc2RsYWtqZGtsYQo=',
      tokenExpirationTime: new Date('2023-09-01T23:10:00.009Z'),
    };

    users.push(user);
  });

  describe('users 값이 주어지면', () => {
    test('길이가 0보다 커야 한다.', () => {
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('createMember 주어지면', () => {
    test('users 정보가 주어지면 정적 팩터리 메서드를 리턴한다.', () => {
      const findUser = users.find((user) => user.id === 1);
      if (findUser === undefined) {
        throw new Error('찾을 수 없는 id 값입니다.');
      }

      const user = User.createMember(findUser);

      expect(user).toEqual({
        id: 1,
        name: '홍길동',
        email: 'abcd@gmail.com',
        password: 'MTIzNAo=',
        role: 'USER',
        refreshToken: 'YXNka2Fsc2RsYWtqZGtsYQo=',
        tokenExpirationTime: expect.anything(),
      });
    });
  });
});
