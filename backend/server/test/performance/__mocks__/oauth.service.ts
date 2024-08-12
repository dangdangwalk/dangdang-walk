import { RequestToken, RequestTokenRefresh, RequestUserInfo } from '../../../src/auth/oauth/oauth.service.interface';

export const MockOauthService = {
    requestToken: () =>
        ({
            access_token: 'mock_oauth_access_token',
            refresh_token: 'mock_oauth_refresh_token',
        }) as RequestToken,

    requestUserInfo: () =>
        ({
            oauthId: '12345',
            oauthNickname: 'mock_oauth_nickname',
            email: 'mock_email@example.com',
            profileImageUrl: 'mock_profile_image.jpg',
        }) as RequestUserInfo,

    requestTokenExpiration: () => {},

    requestUnlink: () => {},

    requestTokenRefresh: () =>
        ({
            access_token: 'new_mock_oauth_access_token',
            refresh_token: 'new_mock_oauth_refresh_token',
        }) as RequestTokenRefresh,
};
