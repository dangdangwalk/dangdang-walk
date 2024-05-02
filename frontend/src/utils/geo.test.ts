import { getSidoCode, gpsToGrid } from './geo';
import { describe, expect, it } from 'vitest';

const result = [
    { nx: 60, ny: 127 },
    { nx: 97, ny: 74 },
    { nx: 53, ny: 38 },
];
describe('위치 정보 관환 테스트', () => {
    it('위도경도 정보로 격자 정보 변환 확인', () => {
        const latLng = [
            { lat: 37.579871128849334, lng: 126.98935225645432 },
            { lat: 35.101148844565955, lng: 129.02478725562108 },
            { lat: 33.500946412305076, lng: 126.54663058817043 },
        ];

        const grid = latLng.map((latlng) => gpsToGrid(latlng.lat, latlng.lng));

        grid.forEach((g, i) => {
            expect(g).toStrictEqual(result[i]);
        });
    });
    it('시도 코드 가져오기', () => {
        const seoul = getSidoCode('서울특별시');
        const chung = getSidoCode('충청북도');

        const undifine = getSidoCode('');

        expect(seoul).toBe('서울');
        expect(chung).toBe('충북');
        expect(undifine).toBe('전국');
    });
});
