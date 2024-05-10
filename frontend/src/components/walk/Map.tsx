import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { NAV_HEIGHT, TOP_BAR_HEIGHT, WALK_INFO_HEIGHT } from '@/constants/style';
import { getGeoLocation } from '@/utils/geo';
import React, { useEffect } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}
export default function Map() {
    const onLoad = (lat: number, lng: number): any => {
        const container = document.getElementById(`map`); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new window.kakao.maps.LatLng(lat, lng), // 지도 중심 좌표
            level: 3, // 지도의 레벨(확대, 축소 정도)
        };
        new window.kakao.maps.Map(container, options);
    };
    useEffect(() => {
        getGeoLocation(DEFAULT_LAT, DEFAULT_LNG, onLoad);
    }, []);

    return (
        <div
            id="map"
            style={{ width: '100vw', height: `calc(100vh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT} - ${WALK_INFO_HEIGHT} )` }}
        />
    );
}
