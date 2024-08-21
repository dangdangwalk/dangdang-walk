import * as path from 'path';

import * as dotenv from 'dotenv';

const WEATHER_BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/';

const envPath = path.resolve(process.cwd(), '..', '.env');

dotenv.config({ path: envPath });

export class Url {
    private apiTypeSignature: string;
    private numOfRows: number;
    private pageNo: number;
    private baseTime: string;
    private nx: number;
    private ny: number;

    private getDate() {
        const now = new Date();
        return `${now.getFullYear().toString()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    }

    constructor(apiTypeSignature: string, numOfRows: number, pageNo: number, baseTime: string, nx: number, ny: number) {
        this.apiTypeSignature = apiTypeSignature;
        this.numOfRows = numOfRows;
        this.pageNo = pageNo;
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
            `&base_date=${this.getDate()}&base_time=${this.baseTime}` +
            `&nx=${this.nx}&ny=${this.ny}`
        );
    }
}
