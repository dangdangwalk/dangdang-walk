import { Users } from './users.entity';
import { mockUser } from '../fixture/users.fixture';

describe('User', () => {
    it('user 정보가 주어지면 user 정보를 리턴해야 한다.', () => {
        expect(mockUser).toEqual({
            id: 1,
            mainDogId: 1,
            nickname: '오징어1234',
            oauthId: '1',
            oauthAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2ODc1NzUzNCwiZXhwIjoxNjY4ODQzOTM0fQ.fwjmKJZ7enTKt7tPfNx-ZG_rczvhkz2ktMV5pDNbxkw',
            oauthRefreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM',
            refreshToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM',
            role: 'USER',
            createdAt: expect.any(Date),
        });
    });

    it('user 정보가 없으면 빈 객체를 리턴해야 한다.', () => {
        const user = new Users();

        expect(user).toEqual({});
    });
});
