import { RequestToken, RequestTokenRefresh, RequestUserInfo } from '../oauth.service.interface';

export const MockOauthService = {
    requestToken: jest.fn().mockResolvedValue({
        access_token: 'mock_oauth_access_token',
        refresh_token: 'mock_oauth_refresh_token',
    } as RequestToken),

    requestUserInfo: jest.fn().mockResolvedValue({
        oauthId: '12345',
        oauthNickname: 'mock_oauth_nickname',
        email: 'mock_email@example.com',
        profileImageUrl: 'mock_profile_image.jpg',
    } as RequestUserInfo),

    requestTokenExpiration: jest.fn(),

    requestUnlink: jest.fn(),

    requestTokenRefresh: jest.fn().mockResolvedValue({
        access_token: 'new_mock_oauth_access_token',
        refresh_token: 'new_mock_oauth_refresh_token',
    } as RequestTokenRefresh),
};
