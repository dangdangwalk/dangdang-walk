"use strict";
const _roletype = require("./types/role.type");
const _usersentity = require("./users.entity");
const _constants = require("../../test/constants");
const _usersfixture = require("../fixtures/users.fixture");
describe('User', ()=>{
    it('user 정보가 주어지면 user 정보를 반환해야 한다.', ()=>{
        expect(_usersfixture.mockUser).toEqual({
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
            createdAt: expect.any(Date)
        });
    });
    it('user 정보가 없으면 빈 객체를 반환해야 한다.', ()=>{
        const user = new _usersentity.Users({});
        expect(user).toEqual({});
    });
});

//# sourceMappingURL=users.spec.js.map