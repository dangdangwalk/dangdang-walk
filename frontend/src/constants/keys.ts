const tokenKeys = {
    AUTHORIZATION: 'Authorization',
} as const;

const cookieKeys = {
    EXPIRES_IN: 'expiresIn',
    IS_SIGNED_IN: 'isSignedIn',
} as const;

const queryKeys = {
    AUTH: 'auth',
    DOGS: 'dogs',
    BREEDS: 'breeds',
    GET_ACCESS_TOKEN: ['auth', 'getAccessToken'],
    GET_IMAGE_URL: 'getImageURL',
    WALK_AVAILABLE_DOGS: 'walkAvailableDogs',
    GET_PROFILE: ['auth', 'getProfile'],
    GET_DOG_RECENT_MONTH_STATISTICS: 'getDogRecentMonthStatistic',
    DOG_STATISTICS: 'dogStatistics',
} as const;

const storageKeys = {
    REDIRECT_URI: 'redirectURI',
    PROVIDER: 'provider',
    DOGS: 'dogs',
    IS_SIGNED_IN: 'isSignedIn',
} as const;

const queryStringKeys = {
    DOGID: 'dogId',
    DATE: 'date',
} as const;

export { tokenKeys, cookieKeys, queryKeys, storageKeys, queryStringKeys };
