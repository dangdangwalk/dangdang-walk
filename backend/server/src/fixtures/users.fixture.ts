import {
    OAUTH_ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    VALID_PROVIDER_KAKAO,
    VALID_REFRESH_TOKEN_100_YEARS,
} from '../../test/constants';
import { ROLE } from '../users/types/role.type';
import { Users } from '../users/users.entity';

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

export const mockUserProfile = {
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    provider: VALID_PROVIDER_KAKAO,
};
