/// <reference types="jest" />
export declare const MockOauthService: {
    requestToken: jest.Mock<any, any, any>;
    requestUserInfo: jest.Mock<any, any, any>;
    requestTokenExpiration: jest.Mock<any, any, any>;
    requestUnlink: jest.Mock<any, any, any>;
    requestTokenRefresh: jest.Mock<any, any, any>;
};
