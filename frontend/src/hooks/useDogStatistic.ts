import { fetchDogStatistic } from '@/api/dogs';
import { useQuery } from '@tanstack/react-query';

const useDogStatistic = () => {
    const { data, isLoading } = useQuery({ queryKey: ['dog-statistic'], queryFn: fetchDogStatistic });

    return { dogs: data, isDogsLoading: isLoading };
};

export default useDogStatistic;
