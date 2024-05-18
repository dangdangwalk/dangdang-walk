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
    GET_IMAGE_URL: 'getImageURL',
    WALK_AVAILABLE_DOGS: 'walkAvailableDogs',
} as const;

const storageKeys = {
    REDIRECT_URI: 'redirectURI',
    PROVIDER: 'provider',
    DOGS: 'dogs',
} as const;

const queryStringKeys = {
    DOGID: 'dogId',
} as const;

export { tokenKeys, cookieKeys, queryKeys, storageKeys, queryStringKeys };
