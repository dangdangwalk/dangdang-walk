const tokenKeys = {
    AUTHORIZATION: 'Authorization',
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
    ADDRESS: 'address',
    AIR_GRADE: 'airGrade',
    SUNSET_SUNRISE: 'sunsetSunrise',
    WEATHER: 'weather',
    JOURNALS: 'journals',
} as const;

const storageKeys = {
    REDIRECT_URI: 'redirectURI',
    PROVIDER: 'provider',
    DOGS: 'dogs',
    IS_SIGNED_IN: 'isSignedIn',
    DATA_URL: 'dataUrl',
} as const;

const queryStringKeys = {
    DOG_ID: 'dogId',
    DATE: 'date',
} as const;

export { tokenKeys, queryKeys, storageKeys, queryStringKeys };
