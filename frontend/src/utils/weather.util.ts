import { Weather } from '@/models/weather.model';

export const airGrade = ['', '좋음', '보통', '나쁨', '매우나쁨'];

export type SkyStatus = 'dayclear' | 'daycloudy' | 'cloudy' | 'nightclear' | 'nightcloudy' | 'rain' | 'snow';

interface SkyParams {
    maxTemperature?: number;
    minTemperature?: number;
    sky: number;
    sunrise: string | undefined;
    sunset: string | undefined;
    temperature?: number;
    airGrade?: number;
    precipitation: number;
    time: string;
}

export const getSkyGrade = ({ sky, sunrise, sunset, precipitation, time }: SkyParams): SkyStatus => {
    if (precipitation) {
        return precipitation === 1 || precipitation === 5 ? 'rain' : 'snow';
    }
    if (sky === 4) {
        return 'cloudy';
    }

    if (Number(time) >= Number(sunrise) && Number(time) <= Number(sunset)) {
        return sky <= 2 ? 'dayclear' : 'daycloudy';
    }

    return sky <= 2 ? 'nightclear' : 'nightcloudy';
};

export const weatherStatus = (temperature: number, precipitation: number) => {
    return precipitation === 0 && temperature >= 0 && temperature <= 28;
};
