import { NAV_HEIGHT, TOP_BAR_HEIGHT, WALK_INFO_HEIGHT } from '@/constants/style';
import { Position } from '@/models/location.model';
import React, { useEffect } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}
export default function Map({ position }: { position: Position | null }) {
    useEffect(() => {
        const kakaoScript = document.getElementById('kakao-script');
        if (kakaoScript) return;
        if (!position) return;
        const script = document.createElement('script');
        script.id = 'kakao-map';
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_ID}`;

        document.head.appendChild(script);

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(position.lat, position.lng),
                };
                const map = new window.kakao.maps.Map(container, options);
                const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);
            });
        };
        script.addEventListener('load', onLoadKakaoMap);

        return () => script.removeEventListener('load', onLoadKakaoMap);
    }, [position]);
    return (
        <div
            id="map"
            style={{ width: '100vw', height: `calc(100vh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT} - ${WALK_INFO_HEIGHT} )` }}
        />
    );
}
