export interface DogStatistic {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
    recommendedWalkAmount: number;
    todayWalkAmount: number;
    weeklyWalks: number[];
}
