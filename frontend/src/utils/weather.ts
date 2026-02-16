const airStatus = ['', '좋음', '보통', '나쁨', '매우나쁨'];
export type AirGrade = 1 | 2 | 3 | 4;

export const getAirStatus = (airGrade: AirGrade | undefined) => {
    if (!airGrade) return airStatus[2];
    return airStatus[airGrade];
};

export type SkyStatus = 'dayClear' | 'dayCloudy' | 'cloudy' | 'nightClear' | 'nightCloudy' | 'rain' | 'snow';

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

    const sunriseTime = Number(sunrise) || 600;
    const sunsetTime = Number(sunset) || 1800;

    if (Number(time) >= sunriseTime && Number(time) <= sunsetTime) {
        return sky <= 2 ? 'dayClear' : 'dayCloudy';
    }

    return sky <= 2 ? 'nightClear' : 'nightCloudy';
};

export const weatherStatus = (temperature: number | undefined, precipitation: number | undefined): boolean => {
    return precipitation === 0 && temperature !== undefined && temperature >= 0 && temperature <= 28;
};
