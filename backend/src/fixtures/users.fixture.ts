import { VALID_REFRESH_TOKEN_100_YEARS } from '../../test/test-utils';
import { ROLE } from '../users/types/role.type';
import { Users } from '../users/users.entity';

export const OAUTH_ACCESS_TOKEN = 'oauth_access_token';
export const OAUTH_REFRESH_TOKEN = 'oauth_refresh_token';

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
    refreshToken: VALID_REFRESH_TOKEN_100_YEARS,
    createdAt: new Date('2019-01-01'),
});
