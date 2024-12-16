import {
    RequestTokenRefreshResponse,
    RequestTokenResponse,
    UserInfo,
} from '../../../src/auth/oauth/oauth.service.base';

export const MockOauthService = {
    requestToken: () =>
        ({
            access_token: 'mock_oauth_access_token',
            refresh_token: 'mock_oauth_refresh_token',
        }) as RequestTokenResponse,

    requestUserInfo: () =>
        ({
            oauthId: '12345',
            oauthNickname: 'mock_oauth_nickname',
            email: 'mock_email@example.com',
            profileImageUrl: 'mock_profile_image.jpg',
        }) as UserInfo,

    requestTokenExpiration: () => {},

    requestUnlink: () => {},

    requestTokenRefresh: () =>
        ({
            access_token: 'new_mock_oauth_access_token',
            refresh_token: 'new_mock_oauth_refresh_token',
        }) as RequestTokenRefreshResponse,
};
