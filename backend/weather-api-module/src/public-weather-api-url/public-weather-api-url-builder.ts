import { PublicWeatherApiUrl } from './public-weather-api-url';

import { WeatherApiType } from '../weather/weather-type';

export class PublicWeatherApiUrlBuilder {
    private apiTypeSignature: string;
    private numOfRows: number;
    private pageNo: number;
    private baseDate: string;
    private baseTime: string;
    private nx: number;
    private ny: number;

    setApiType(apiType: WeatherApiType) {
        if (apiType === 'predicateDay') this.apiTypeSignature = 'getVilageFcst';
        if (apiType === 'realtimeOneHour') this.apiTypeSignature = 'getUltraSrtNcst';
        return this;
    }

    setNumOfRows(numOfRows: number) {
        this.numOfRows = numOfRows;
        return this;
    }

    setPageNo(pageNo: number) {
        this.pageNo = pageNo;
        return this;
    }

    setBaseDate(baseDate: string) {
        this.baseDate = baseDate;
        return this;
    }

    setBaseTime(baseTime: string) {
        this.baseTime = baseTime;
        return this;
    }

    setLocation(nx: number, ny: number) {
        this.nx = nx;
        this.ny = ny;
        return this;
    }

    build() {
        return new PublicWeatherApiUrl(
            this.apiTypeSignature,
            this.numOfRows,
            this.pageNo,
            this.baseDate,
            this.baseTime,
            this.nx,
            this.ny,
        );
    }
}
