"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUserProfile = exports.mockUser = void 0;
const constants_1 = require("../../test/constants");
const role_type_1 = require("../users/types/role.type");
const users_entity_1 = require("../users/users.entity");
exports.mockUser = new users_entity_1.Users({
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    role: role_type_1.ROLE.User,
    mainDogId: null,
    oauthId: '12345',
    oauthAccessToken: constants_1.OAUTH_ACCESS_TOKEN,
    oauthRefreshToken: constants_1.OAUTH_REFRESH_TOKEN,
    refreshToken: constants_1.VALID_REFRESH_TOKEN_100_YEARS,
    createdAt: new Date('2019-01-01'),
});
exports.mockUserProfile = {
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    provider: constants_1.VALID_PROVIDER_KAKAO,
};
//# sourceMappingURL=users.fixture.js.map