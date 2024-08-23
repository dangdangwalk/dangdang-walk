const WEATHER_BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/';

export class PublicWeatherApiUrl {
    private apiTypeSignature: string;
    private numOfRows: number;
    private pageNo: number;
    private baseDate: string;
    private baseTime: string;
    private nx: number;
    private ny: number;

    constructor(
        apiTypeSignature: string,
        numOfRows: number,
        pageNo: number,
        baseDate: string,
        baseTime: string,
        nx: number,
        ny: number,
    ) {
        this.apiTypeSignature = apiTypeSignature;
        this.numOfRows = numOfRows;
        this.pageNo = pageNo;
        this.baseDate = baseDate;
        this.baseTime = baseTime;
        this.nx = nx;
        this.ny = ny;
    }

    toString() {
        return (
            WEATHER_BASE_URL +
            this.apiTypeSignature +
            `?serviceKey=${process.env.WEATHER_KEY}` +
            '&dataType=JSON' +
            `&numOfRows=${this.numOfRows}&pageNo=${this.pageNo}` +
            `&base_date=${this.baseDate}&base_time=${this.baseTime}` +
            `&nx=${this.nx}&ny=${this.ny}`
        );
    }
}
