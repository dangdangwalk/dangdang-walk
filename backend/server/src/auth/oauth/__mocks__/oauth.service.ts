import { OauthLoginData, OauthReissueData, OauthSignupData } from '../oauth.service.base';

export const MockOauthService = {
    login: jest.fn().mockResolvedValue({
        oauthAccessToken: 'mock_oauth_access_token',
        oauthRefreshToken: 'mock_oauth_refresh_token',
        oauthId: '12345',
        oauthNickname: 'mock_oauth_nickname',
        email: 'mock_email@example.com',
        profileImageUrl: 'mock_profile_image.jpg',
    } as OauthLoginData),

    signup: jest.fn().mockResolvedValue({
        oauthId: '12345',
        oauthNickname: 'mock_oauth_nickname',
        email: 'mock_email@example.com',
        profileImageUrl: 'mock_profile_image.jpg',
    } as OauthSignupData),

    logout: jest.fn(),

    reissueTokens: jest.fn().mockResolvedValue({
        oauthAccessToken: 'new_mock_oauth_access_token',
        oauthRefreshToken: 'new_mock_oauth_refresh_token',
    } as OauthReissueData),

    deactivate: jest.fn(),
};
