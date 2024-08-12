"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mockUser: function() {
        return mockUser;
    },
    mockUserProfile: function() {
        return mockUserProfile;
    }
});
const _constants = require("../../test/constants");
const _roletype = require("../users/types/role.type");
const _usersentity = require("../users/users.entity");
const mockUser = new _usersentity.Users({
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    role: _roletype.ROLE.User,
    mainDogId: null,
    oauthId: '12345',
    oauthAccessToken: _constants.OAUTH_ACCESS_TOKEN,
    oauthRefreshToken: _constants.OAUTH_REFRESH_TOKEN,
    refreshToken: _constants.VALID_REFRESH_TOKEN_100_YEARS,
    createdAt: new Date('2019-01-01')
});
const mockUserProfile = {
    id: 1,
    nickname: 'mock_oauth_nickname#12345',
    email: 'mock_email@example.com',
    profileImageUrl: 'mock_profile_image.jpg',
    provider: _constants.VALID_PROVIDER_KAKAO
};

//# sourceMappingURL=users.fixture.js.map