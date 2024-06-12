import { fetchDogStatistic } from '@/api/dog';
import { FIFTEEN_MIN, queryKeys } from '@/constants';
import { DogStatistic } from '@/models/dog';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

const defaultDogs: DogStatistic[] = [
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
];

const useDogsStatistic = () => {
    const { isSignedIn } = useAuthStore();
    const { data, isPending } = useQuery({
        queryKey: [queryKeys.DOG_STATISTICS],
        queryFn: fetchDogStatistic,
        staleTime: FIFTEEN_MIN,
    });

    if (!isSignedIn) {
        return { dogsStatistic: defaultDogs, isDogsPending: false };
    }
    return { dogsStatistic: data, isDogsPending: isPending };
};

export default useDogsStatistic;
