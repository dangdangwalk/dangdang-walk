"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockOauthService = void 0;
exports.MockOauthService = {
    requestToken: jest.fn().mockResolvedValue({
        access_token: 'mock_oauth_access_token',
        refresh_token: 'mock_oauth_refresh_token',
    }),
    requestUserInfo: jest.fn().mockResolvedValue({
        oauthId: '12345',
        oauthNickname: 'mock_oauth_nickname',
        email: 'mock_email@example.com',
        profileImageUrl: 'mock_profile_image.jpg',
    }),
    requestTokenExpiration: jest.fn(),
    requestUnlink: jest.fn(),
    requestTokenRefresh: jest.fn().mockResolvedValue({
        access_token: 'new_mock_oauth_access_token',
        refresh_token: 'new_mock_oauth_refresh_token',
    }),
};
//# sourceMappingURL=oauth.service.js.map