import { useWeather } from '@/hooks/useWeather';
import { getCurrentTime } from '@/utils/time';
import { formatTemperature } from '@/utils/format';
import { AirGrade, SkyStatus, getAirStatus, getSkyGrade, weatherStatus } from '@/utils/weather';
import { useEffect, useState } from 'react';
import Cloudy from '@/assets/icons/ic-cloudy.svg';
import Rain from '@/assets/icons/ic-rain.svg';
import Snow from '@/assets/icons/ic-snow.svg';
import DayClear from '@/assets/icons/ic-day-clear.svg';
import NightClear from '@/assets/icons/ic-night-clear.svg';
import NightCloudy from '@/assets/icons/ic-night-cloudy.svg';
import DayCloudy from '@/assets/icons/ic-day-cloudy.svg';
import useSunsetSunrise from '@/hooks/useSunsetSunrise';
import Spinner from '@/components/commons/Spinner';
import useAddressAndAirGrade from '@/hooks/useAddressAndAirgrade';
import { Weather } from '@/models/weather';
import { Position } from '@/models/location';

const statusImage = {
    rain: Rain,
    snow: Snow,
    dayClear: DayClear,
    dayCloudy: DayCloudy,
    nightClear: NightClear,
    nightCloudy: NightCloudy,
    cloudy: Cloudy,
} as const;

export default function WeatherInfo({ position }: { position: Position | null }) {
    const { weather, isWeatherPending } = useWeather(position);
    const { airGrade, address, isAirGradePending } = useAddressAndAirGrade(position);
    const { sunset, sunrise, isSunsetSunrisePending } = useSunsetSunrise(position);

    const [skyStatus, setSkyStatus] = useState<SkyStatus>();

    const isLoading = isAirGradePending || isSunsetSunrisePending || isWeatherPending;

    useEffect(() => {
        if (isSunsetSunrisePending || isWeatherPending || !weather) return;
        const time = getCurrentTime(new Date());
        const skyGrade = getSkyGrade({ ...weather, sunrise, sunset, time });
        setSkyStatus(skyGrade);
    }, [weather, isSunsetSunrisePending]);

    if (isLoading) {
        return <Spinner className="h-[164px]" />;
    }

    return (
        <figure className="flex justify-between py-4">
            <div className="inline-flex flex-col items-start justify-between">
                <WeatherMessage temperature={weather?.temperature} precipitation={weather?.precipitation} />
                <WeatherLocationInfo address={address} airGrade={airGrade} />
            </div>
            <WeatherIconAndTemperature weather={weather} skyStatus={skyStatus} />
        </figure>
    );
}

interface WeatherMessageProps {
    temperature?: number;
    precipitation?: number;
}

const WeatherMessage = ({ temperature, precipitation }: WeatherMessageProps) => (
    <div className="text-[28px] font-bold leading-[42px] text-black">
        {weatherStatus(temperature, precipitation) ? (
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
);

interface WeatherLocationInfoProps {
    address: string | undefined;
    airGrade: AirGrade | undefined;
}

const WeatherLocationInfo = ({ address, airGrade }: WeatherLocationInfoProps) => (
    <div className="flex flex-col items-start justify-between pl-1">
        <p className="text-xs font-normal leading-[18px] text-zinc-500">위치 : {address}</p>
        <div className="text-xs font-normal leading-[18px] text-zinc-500">대기질 : {getAirStatus(airGrade)}</div>
    </div>
);

interface WeatherIconAndTemperatureProps {
    weather?: Weather | null | undefined;
    skyStatus?: SkyStatus;
}
const WeatherIconAndTemperature = ({ weather, skyStatus }: WeatherIconAndTemperatureProps) => (
    <div className="inline-flex flex-col items-center justify-start gap-3.5">
        <div className="flex size-[100px] items-center justify-center">
            {skyStatus && <img src={statusImage[skyStatus]} alt={skyStatus} />}
        </div>
        <div className="text-xs font-normal leading-[18px] text-zinc-500">{`최고:${formatTemperature(weather?.maxTemperature)} 최저:${formatTemperature(weather?.minTemperature)}`}</div>
    </div>
);
