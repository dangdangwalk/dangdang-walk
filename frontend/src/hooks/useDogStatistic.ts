import { fetchDogStatistic } from '@/api/dog';
import { useQuery } from '@tanstack/react-query';

const useDogStatistic = () => {
    const { data, isLoading } = useQuery({ queryKey: ['dog-statistic'], queryFn: fetchDogStatistic });

    return { dogs: data, isDogsLoading: isLoading };
};

export default useDogStatistic;
