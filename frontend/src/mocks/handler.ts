import { http, HttpResponse } from 'msw';

const { REACT_APP_NEST_BASE_URL: NEST_BASE_URL = '' } = window._ENV ?? process.env;

export const handlers = [
    http.get(`${NEST_BASE_URL}/dogs/statistics`, async () => {
        return HttpResponse.json([
            {
                id: 1,
                name: '덕지',
                profilePhotoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg',
                recommendedWalkAmount: 1800,
                todayWalkAmount: 900,
                weeklyWalks: [1, 0, 2, 0, 0, 0, 0],
            },
            {
                id: 2,
                name: '철도',
                profilePhotoUrl: '',
                recommendedWalkAmount: 1800,
                todayWalkAmount: 1000,
                weeklyWalks: [0, 2, 0, 0, 3, 0, 0],
            },
        ]);
    }),
];
