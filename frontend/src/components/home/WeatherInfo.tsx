import { useWeather } from '@/hooks/useWeather';
import { getCurrentTime } from '@/utils/date';
import { temperFormat } from '@/utils/format';
import { SkyStatus, airGrade, getSkyGrade, weatherStatus } from '@/utils/weather.util';
import { useEffect, useState } from 'react';

export default function WeatherInfo() {
    const { weather, address } = useWeather();
    const [skyStatus, setSkyStatus] = useState<SkyStatus>();

    useEffect(() => {
        setSkyStatus(getSkyGrade({ ...weather, time: getCurrentTime(new Date()) }));
    }, [weather]);

    return (
        <figure className="flex justify-between">
            <div>
                <div>
                    {weatherStatus(weather.temperature, weather.precipitation)
                        ? '산책하기 좋은\n날씨에요'
                        : `오늘은 집에서\n쉬고싶어요!`}
                </div>
                <div>
                    <span>위치 : </span> <span>{address}</span>
                </div>
                <div>
                    <span>대기질 : </span>
                    <span>{airGrade[weather?.airGrade ?? 0]}</span>
                </div>
            </div>
            <div>
                <img src={`/assets/icons/ic_${skyStatus}.svg`} alt={skyStatus} />
                <div>{`최고:${temperFormat(weather.maxTemperature)} 최저:${weather.minTemperature}`}</div>
            </div>
        </figure>
    );
}
