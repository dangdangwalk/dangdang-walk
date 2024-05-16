import { fetchDogStatistic } from '@/api/dogs';
import { DogStatistic } from '@/models/dog.model';
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

const useDogStatistic = (isLoggedIn: boolean, queryOptions?: UseQueryCustomOptions) => {
    const { data, isPending } = useQuery({
        queryKey: ['dog-statistic'],
        queryFn: fetchDogStatistic,
        ...queryOptions,
    });
    if (!isLoggedIn) {
        return { dogs: defaultDpgs as DogStatistic[], isDogsPending: false };
    }
    return { dogs: data as DogStatistic[], isDogsPending: isPending };
};

export default useDogStatistic;
