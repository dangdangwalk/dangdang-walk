import { ROLE } from '../users/types/role.type';
import { Users } from '../users/users.entity';

const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM';
const OAUTH_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2ODc1NzUzNCwiZXhwIjoxNjY4ODQzOTM0fQ.fwjmKJZ7enTKt7tPfNx-ZG_rczvhkz2ktMV5pDNbxkw';
const OAUTH_REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM';

export const mockUser = new Users({
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    role: ROLE.User,
    mainDogId: null,
    oauthId: '12345',
    oauthAccessToken: OAUTH_ACCESS_TOKEN,
    oauthRefreshToken: OAUTH_REFRESH_TOKEN,
    refreshToken: REFRESH_TOKEN,
    createdAt: new Date('2019-01-01'),
});
