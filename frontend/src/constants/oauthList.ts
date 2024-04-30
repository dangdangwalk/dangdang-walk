export type OAuth = {
    PROVIDER: string;
    NAME: string;
};
export const OAUTH: OAuth[] = [
    {
        PROVIDER: 'google',
        NAME: '구글',
    },
    {
        PROVIDER: 'kakao',
        NAME: '카카오',
    },
    {
        PROVIDER: 'naver',
        NAME: '네이버',
    },
];
