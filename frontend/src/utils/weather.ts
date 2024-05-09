const airStatus = ['', '좋음', '보통', '나쁨', '매우나쁨'];
export type AirGrade = 1 | 2 | 3 | 4;

export const getAirStatus = (airGrade: AirGrade | undefined) => {
    if (!airGrade) return airStatus[2];
    return airStatus[airGrade];
};

export type SkyStatus = 'dayclear' | 'daycloudy' | 'cloudy' | 'nightclear' | 'nightcloudy' | 'rain' | 'snow';

interface SkyParams {
    maxTemperature?: number;
    minTemperature?: number;
    sky: number;
    temperature?: number;
    airGrade?: number;
    precipitation: number;
    sunset: string | undefined;
    sunrise: string | undefined;
    time: string;
}

export const getSkyGrade = ({ sky, precipitation, sunset, sunrise, time }: SkyParams): SkyStatus => {
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
