import { useWeather } from '@/hooks/useWeather';
import { getCurrentTime } from '@/utils/date';
import { temperFormat } from '@/utils/format';
import { SkyStatus, getAirStatus, getSkyGrade, weatherStatus } from '@/utils/weather';
import { useEffect, useState } from 'react';
import Cloudy from '@/assets/icons/ic-cloudy.svg';
import Rain from '@/assets/icons/ic-rain.svg';
import Snow from '@/assets/icons/ic-snow.svg';
import DayClear from '@/assets/icons/ic-dayclear.svg';
import NightClear from '@/assets/icons/ic-nightclear.svg';
import NightCloudy from '@/assets/icons/ic-nightcloudy.svg';
import DayCloudy from '@/assets/icons/ic-daycloudy.svg';
import useAddressAndAirgrade from '@/hooks/useAddressAndAirgrade';
import useSunsetSunrise from '@/hooks/useSunsetSunrise';

const statusImage = {
    rain: Rain,
    snow: Snow,
    dayclear: DayClear,
    daycloudy: DayCloudy,
    nightclear: NightClear,
    nightcloudy: NightCloudy,
    cloudy: Cloudy,
};

export default function WeatherInfo() {
    const { weather } = useWeather();
    const [skyStatus, setSkyStatus] = useState<SkyStatus>();
    const { airGrade, address } = useAddressAndAirgrade();
    const { sunset, sunrise } = useSunsetSunrise();

    useEffect(() => {
        if (!sunrise || !weather) return;
        const time = getCurrentTime(new Date());
        const skyGrade = getSkyGrade({ ...weather, sunrise, sunset, time });
        setSkyStatus(skyGrade);
    }, [weather, sunset, sunrise]);

    return (
        <figure className="py-4 flex justify-between ">
            <div className="flex-col justify-between items-start inline-flex ">
                <div className="text-black font-bold text-[28px] leading-[42px]">
                    {weatherStatus(weather.temperature, weather.precipitation) ? (
                        <div>
                            산책하기 좋은 <br /> 날씨에요
                        </div>
                    ) : (
                        <div>
                            오늘은 집에서
                            <br />
                            쉬고 싶어요!
                        </div>
                    )}
                </div>
                <div className="pl-1 flex-col justify-between items-start flex">
                    <p className="text-zinc-500 text-xs font-normal leading-[18px]">위치 : {address}</p>
                    <div className="text-[#999999] text-xs font-normal leading-[18px]">
                        대기질 : {getAirStatus(airGrade)}
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-center gap-3.5 inline-flex">
                <img className="w-full" src={statusImage[skyStatus ?? 'dayclear']} alt={skyStatus} />
                <div className="text-zinc-500 text-xs font-normal leading-[18px]">{`최고:${temperFormat(weather.maxTemperature)} 최저:${weather.minTemperature}`}</div>
            </div>
        </figure>
    );
}
