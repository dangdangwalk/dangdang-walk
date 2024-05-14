import { fetchDogStatistic } from '@/api/dogs';
import { DogStatistic } from '@/components/home/DogCard';
import { UseQueryCustomOptions } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

const useDogStatistic = (queryOptions?: UseQueryCustomOptions) => {
    const { data, isLoading } = useQuery({ queryKey: ['dog-statistic'], queryFn: fetchDogStatistic, ...queryOptions });

    return { dogs: data as DogStatistic[], isDogsLoading: isLoading };
};

export default useDogStatistic;
