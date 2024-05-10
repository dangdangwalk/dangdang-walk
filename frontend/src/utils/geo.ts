const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)
const DEGRAD = Math.PI / 180.0;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

interface Grid {
    nx: number;
    ny: number;
}
export const gpsToGrid = (lat: number, lng: number): Grid => {
    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let theta = lng * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
};
const sidoCode: Map<string, string> = new Map([
    ['서울특별시', '서울'],
    ['부산광역시', '부산'],
    ['대구광역시', '대구'],
    ['인천광역시', '인천'],
    ['광주광역시', '광주'],
    ['대전광역시', '대전'],
    ['울산광역시', '울산'],
    ['경기도', '경기'],
    ['강원도', '강원'],
    ['충청북도', '충북'],
    ['충청남도', '충남'],
    ['전라북도', '전북'],
    ['전라남도', '전남'],
    ['경상북도', '경북'],
    ['경상남도', '경남'],
    ['제주특별시', '제주'],
    ['세종특별자치시', '세종'],
]);

//서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종

export const getSidoCode = (sido: string | undefined): string => {
    if (!sido) return '전국';
    return sidoCode.get(sido) ?? '전국';
};

export const getGeoLocation = (def_lat: number, def_lng: number, onSuccess: (lat: number, lng: number) => {}) => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            onSuccess(latitude, longitude);
        });
    } else {
        onSuccess(def_lat, def_lng);
    }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};
