import { fetchDogMonthStatistic, Period } from '@/api/dog';
import { useStore } from '@/store';
import { formatDate, getCurrentWeek } from '@/utils/time';
import { useQuery } from '@tanstack/react-query';

export const useDogStatistic = (dogId: number, date: Date, period: Period) => {
    const isSignedIn = useStore((state) => state.isSignedIn);
    const keyDate = getKeyDate(date, period);
    const { data, isLoading } = useQuery({
        queryKey: [dogId, keyDate, period],
        queryFn: async () => {
            if (!dogId) return;
            return await fetchDogMonthStatistic(dogId, keyDate, period);
        },
        enabled: !!dogId && isSignedIn,
    });

    return { data, isLoading };
};
const getKeyDate = (date: Date, period: Period): string => {
    const weekStartDate = getCurrentWeek(date)[0];
    if (!weekStartDate) {
        throw new Error('Invalid date: week start date is undefined');
    }
    const monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return period === 'month' ? formatDate(monthStartDate) : formatDate(weekStartDate);
};
