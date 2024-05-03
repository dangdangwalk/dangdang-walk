import { fetchCurrentWeather } from '@/api/weather.api';
import { getCurrentDate, getHours } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';

export const useWeather = ({ nx, ny }: { nx: number; ny: number }) => {
    const date = getCurrentDate(new Date());

    const { isLoading, error, data } = useQuery({
        queryKey: ['weather'],
        queryFn: fetchCurrentWeather(date, nx, ny),
    });

    // const weatherList = data?.filter((d) => d.baseDate === date);
    // const maxTemperature = weatherList?.find((w) => w.category === 'TMX')?.fcstValue;
    // const minTemperature = weatherList?.find((w) => w.category === 'TMN')?.fcstValue;
};
