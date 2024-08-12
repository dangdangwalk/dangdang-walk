export declare const mockJournal: {
    userId: number;
    routes: string;
    calories: number;
    memo: string;
    startedAt: string;
    duration: number;
    distance: number;
};
export declare const mockJournalDogs: {
    journalId: number;
    dogId: number;
}[];
export declare const mockJournalPhotos: {
    journalId: number;
    photoUrl: string;
}[];
export declare const mockExcrements: (
    | {
          journalId: number;
          dogId: number;
          type: 'FECES';
          coordinate: string;
      }
    | {
          journalId: number;
          dogId: number;
          type: 'URINE';
          coordinate: string;
      }
)[];
export declare const createMockJournal: {
    dogs: number[];
    journalInfo: {
        distance: number;
        calories: number;
        startedAt: string;
        duration: number;
        routes: {
            lat: number;
            lng: number;
        }[];
        journalPhotos: string[];
        memo: string;
    };
    excrements: {
        dogId: number;
        fecesLocations: {
            lat: string;
            lng: string;
        }[];
        urineLocations: {
            lat: string;
            lng: string;
        }[];
    }[];
};
export declare const mockJournalProfile: {
    journalInfo: {
        id: number;
        routes: {
            lat: number;
            lng: number;
        }[];
        memo: string;
        journalPhotos: string[];
    };
    dogs: {
        id: number;
        name: string;
        profilePhotoUrl: string;
    }[];
    excrements: {
        dogId: number;
        fecesCnt: number;
        urineCnt: number;
    }[];
};
