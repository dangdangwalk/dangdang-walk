export interface DogsWeeklyWalkOverviewResponse {
    id: number;
    name: string;
    profilePhotoUrl: string | null;
    recommendedWalkAmount: number;
    todayWalkAmount: number;
    weeklyWalks: number[];
}

export interface DogWalkingTotalResponse {
    totalWalkCnt: number;
    totalDistance: number;
    totalTime: number;
}
