import { fetchDogStatistic } from '@/api/dogs';
import { DogStatistic } from '@/components/home/DogCard';
import { UseQueryCustomOptions } from '@/types/common';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const defaultDpgs: DogStatistic[] = [
    {
        id: 1,
        name: '덕지',
        profilePhotoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg',
        recommendedDailyWalkAmount: 1800,
        dailyWalkAmount: 900,
        weeklyWalks: [1, 0, 2, 0, 0, 0, 0],
    },
    {
        id: 2,
        name: '철도',
        profilePhotoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg',
        recommendedDailyWalkAmount: 1800,
        dailyWalkAmount: 1000,
        weeklyWalks: [0, 2, 0, 0, 3, 0, 0],
    },
    {
        id: 3,
        name: '????',
        profilePhotoUrl: '',
        recommendedDailyWalkAmount: 1800,
        dailyWalkAmount: 0,
        weeklyWalks: [0, 1, 1, 0, 0, 0, 0],
    },
];
const useDogStatistic = (queryOptions?: UseQueryCustomOptions) => {
    const { isLoggedIn } = useAuth();
    const { data, isLoading } = useQuery({ queryKey: ['dog-statistic'], queryFn: fetchDogStatistic, ...queryOptions });

    return { dogs: isLoggedIn ? data : defaultDpgs, isDogsLoading: isLoading };
};

export default useDogStatistic;
