import { EXCREMENT } from '../excrements/types/excrement.type';

export const mockJournal = {
    userId: 1,
    routes: '[{"lat": 87.4, "lng" : 85.222}, {"lat": 75.23, "lng" : 104.4839}]',
    calories: 500,
    memo: 'Enjoyed the walk with Buddy!',
    startedAt: '2024-06-12T00:00:00Z',
    duration: 30,
    distance: 5,
};

export const mockJournalDogs = [
    { journalId: 1, dogId: 1 },
    { journalId: 1, dogId: 2 },
];

export const mockJournalPhotos = [
    {
        journalId: 1,
        photoUrl: '1/photo1.jpeg',
    },
    {
        journalId: 1,
        photoUrl: '1/photo2.png',
    },
];

export const mockExcrements = [
    {
        journalId: 1,
        dogId: 1,
        type: EXCREMENT.Feces,
        coordinate: `POINT(87.4 85.222)`,
    },
    {
        journalId: 1,
        dogId: 1,
        type: EXCREMENT.Urine,
        coordinate: `POINT(87.4 85.222)`,
    },
    {
        journalId: 1,
        dogId: 2,
        type: EXCREMENT.Feces,
        coordinate: `POINT(75.23 104.4839)`,
    },
];

export const createMockJournal = {
    dogs: [1, 2],
    journalInfo: {
        distance: 5,
        calories: 500,
        startedAt: '2024-06-12T00:00:00Z',
        duration: 3600,
        routes: [
            { lat: 87.4, lng: 85.222 },
            { lat: 75.23, lng: 104.4839 },
        ],
        journalPhotos: ['1/photo1.jpeg', '1/photo2.png'],
        memo: 'Enjoyed the walk with Buddy!',
    },
    excrements: [
        {
            dogId: 1,
            fecesLocations: [{ lat: '87.4', lng: '85.222' }],
            urineLocations: [{ lat: '87.4', lng: '85.222' }],
        },
        {
            dogId: 2,
            fecesLocations: [{ lat: '75.23', lng: '104.4839' }],
            urineLocations: [],
        },
    ],
};

export const mockJournalProfile = {
    journalInfo: {
        id: 1,
        routes: [
            {
                lat: 87.4,
                lng: 85.222,
            },
            {
                lat: 75.23,
                lng: 104.4839,
            },
        ],
        memo: 'Enjoyed the walk with Buddy!',
        journalPhotos: ['1/photo1.jpeg', '1/photo2.png'],
    },
    dogs: [
        {
            id: 1,
            name: '덕지',
            profilePhotoUrl: 'mock_profile_photo.jpg',
        },
        {
            id: 2,
            name: '루이',
            profilePhotoUrl: 'mock_profile_photo2.jpg',
        },
    ],
    excrements: [
        {
            dogId: 1,
            fecesCnt: 1,
            urineCnt: 1,
        },
        {
            dogId: 2,
            fecesCnt: 1,
            urineCnt: 0,
        },
    ],
};
