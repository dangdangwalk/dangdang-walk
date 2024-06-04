const tokenKeys = {
    AUTHORIZATION: 'Authorization',
} as const;

const cookieKeys = {
    EXPIRES_IN: 'expiresIn',
    IS_LOGGED_IN: 'isLoggedIn',
} as const;

const queryKeys = {
    AUTH: 'auth',
    DOGS: 'dogs',
    BREEDS: 'breeds',
    GET_ACCESS_TOKEN: 'getAccessToken',
    GET_IMAGE_URL: 'getImageURL',
    WALK_AVAILABLE_DOGS: 'walkAvailableDogs',
    GET_PROFILE: 'getProfile',
    GET_DOG_RECENT_MONTH_STATISTICS: 'getDogRecentMonthStatistic',
} as const;

const storageKeys = {
    REDIRECT_URI: 'redirectURI',
    PROVIDER: 'provider',
    DOGS: 'dogs',
    IS_LOGGED_IN: 'isLoggedIn',
} as const;

const queryStringKeys = {
    DOGID: 'dogId',
    DATE: 'date',
} as const;

export { tokenKeys, cookieKeys, queryKeys, storageKeys, queryStringKeys };
