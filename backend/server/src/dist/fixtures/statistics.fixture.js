"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mockJournals: function() {
        return mockJournals;
    },
    mockJournalsDog: function() {
        return mockJournalsDog;
    }
});
const mockJournals = [
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 500,
        memo: '좋은 날씨',
        startedAt: '2024-05-01T10:00:00Z',
        duration: 30,
        distance: 2000
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 600,
        memo: '비가 오는 날',
        startedAt: '2024-05-02T11:00:00Z',
        duration: 45,
        distance: 2500
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 700,
        startedAt: '2024-05-03T12:00:00Z',
        duration: 60,
        distance: 3000
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 800,
        memo: '산책 중에 휴식',
        startedAt: '2024-05-04T13:00:00Z',
        duration: 75,
        distance: 3500
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 900,
        startedAt: '2024-05-05T14:00:00Z',
        duration: 90,
        distance: 4000
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 1000,
        memo: '산책 중에 사진 촬영',
        startedAt: '2024-05-06T15:00:00Z',
        duration: 105,
        distance: 4500
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 1100,
        startedAt: '2024-05-07T16:00:00Z',
        duration: 120,
        distance: 5000
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 1200,
        memo: '산책 중에 친구 만남',
        startedAt: '2024-05-09T17:00:00Z',
        duration: 135,
        distance: 5500
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 1300,
        memo: '산책 후 독서',
        startedAt: '2024-05-09T18:00:00Z',
        duration: 150,
        distance: 6000
    },
    {
        userId: 1,
        routes: '[{"lat": 60.7749, "lag" : 120.4839}, {"lat": 60.7749, "lag" : 104.4839}]',
        calories: 1400,
        memo: '산책 중에 음악 듣기',
        startedAt: '2024-05-30T19:00:00Z',
        duration: 165,
        distance: 6500
    }
];
const mockJournalsDog = [
    {
        journalId: 1,
        dogId: 1
    },
    {
        journalId: 2,
        dogId: 1
    },
    {
        journalId: 3,
        dogId: 1
    },
    {
        journalId: 4,
        dogId: 1
    },
    {
        journalId: 5,
        dogId: 1
    },
    {
        journalId: 6,
        dogId: 1
    },
    {
        journalId: 7,
        dogId: 1
    },
    {
        journalId: 8,
        dogId: 1
    },
    {
        journalId: 9,
        dogId: 1
    },
    {
        journalId: 10,
        dogId: 1
    }
];

//# sourceMappingURL=statistics.fixture.js.map