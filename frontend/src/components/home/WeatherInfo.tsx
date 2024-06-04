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
import Spinner from '@/components/commons/Spinner';
import useGeolocation from '@/hooks/useGeolocation';

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
    const { position } = useGeolocation();
    const { weather, isWeatherPending } = useWeather(position);
    const { airGrade, address, isAirGradePending } = useAddressAndAirgrade(position);
    const { sunset, sunrise, isSunsetSunrisePending } = useSunsetSunrise(position);

    const [skyStatus, setSkyStatus] = useState<SkyStatus>();

    const isLoading = isAirGradePending || isSunsetSunrisePending || isWeatherPending;

    useEffect(() => {
        if (isSunsetSunrisePending || isWeatherPending || !weather) return;
        const time = getCurrentTime(new Date());
        const skyGrade = getSkyGrade({ ...weather, sunrise, sunset, time });
        setSkyStatus(skyGrade);
    }, [weather, isSunsetSunrisePending]);
    useEffect(() => {}, [address]);

    return (
        <>
            {isLoading ? (
                <Spinner className="h-[164px]" />
            ) : (
                <figure className="flex justify-between py-4">
                    <div className="inline-flex flex-col items-start justify-between">
                        <div className="text-[28px] font-bold leading-[42px] text-black">
                            {weatherStatus(weather?.temperature, weather?.precipitation) ? (
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
                        <div className="flex flex-col items-start justify-between pl-1">
                            <p className="text-xs font-normal leading-[18px] text-zinc-500">위치 : {address}</p>
                            <div className="text-xs font-normal leading-[18px] text-[#999999]">
                                대기질 : {getAirStatus(airGrade)}
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex flex-col items-center justify-start gap-3.5">
                        <img src={statusImage[skyStatus ?? 'dayclear']} alt={skyStatus} />
                        <div className="text-xs font-normal leading-[18px] text-zinc-500">{`최고:${temperFormat(weather?.maxTemperature)} 최저:${weather?.minTemperature}`}</div>
                    </div>
                </figure>
            )}
        </>
    );
}
