import { fetchDogStatistic } from '@/api/dog';
import { queryKeys } from '@/constants';
import { DogStatistic } from '@/models/dog';
import { useAuthStore } from '@/store/authStore';
import { UseQueryCustomOptions } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

const defaultDpgs: DogStatistic[] = [
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

const useDogsStatistic = (queryOptions?: UseQueryCustomOptions) => {
    const { isSignedIn } = useAuthStore();
    const { data, isPending } = useQuery({
        queryKey: [queryKeys.DOG_STATISTICS],
        queryFn: fetchDogStatistic,
        ...queryOptions,
    });

    if (!isSignedIn) {
        return { dogs: defaultDpgs as DogStatistic[], isDogsPending: false };
    }
    return { dogs: data as DogStatistic[], isDogsPending: isPending };
};

export default useDogsStatistic;
