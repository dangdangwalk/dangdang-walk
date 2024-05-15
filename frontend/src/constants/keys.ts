const tokenKeys = {
    AUTHORIZATION: 'Authorization',
} as const;

const cookieKeys = {
    EXPIRES_IN: 'expiresIn',
    IS_LOGGED_IN: 'isLoggedIn',
} as const;

const queryKeys = {
    AUTH: 'auth',
    GET_ACCESS_TOKEN: 'getAccessToken',
} as const;

const storageKeys = {
    REDIRECT_URI: 'redirectURI',
    PROVIDER: 'provider',
    DOGS: 'dogs',
} as const;

export { tokenKeys, cookieKeys, queryKeys, storageKeys };
