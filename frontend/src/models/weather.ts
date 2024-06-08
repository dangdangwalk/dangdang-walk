export interface Weather {
    maxTemperature: number;
    minTemperature: number;
    sky: number;
    temperature: number;
    precipitation: number;
}
type weatherCategory =
    | 'POP' //강수확률
    | 'PTY' //강수형태  없음(0) , 비(1) , 눈비(2) ,눈(3) , 빗방울(5) , 빗방울눈날림(6) , 눈날림(7)
    | 'PCP' //1시간 강수량
    | 'REH' // 습도
    | 'SNO' // 1시간 신적설
    | 'SKY' // 하늘상태   맑음(1) , 구름많음(3) ,  흐림(4)
    | 'TMP' //1시간 기온
    | 'TMN' //일 최저 기온
    | 'TMX' // 일 최고 기온
    | 'UUU' // 풍속 동서
    | 'VVV' // 풍속 남북
    | 'WAV' //파고
    | 'VEC' // 풍향
    | 'WSD'; //풍속

export interface WeatherData {
    baseDate: string;
    baseTime: string;
    category: weatherCategory;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}
