import { NAV_HEIGHT, TOP_BAR_HEIGHT, WALK_INFO_HEIGHT } from '@/constants/style';
import { Position } from '@/models/location.model';
import React, { useEffect, useState } from 'react';

const { REACT_APP_KAKAO_MAP_ID: KAKAO_MAP_ID = '' } = window._ENV ?? process.env;

export default function Map({ position }: { position: Position | null }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const kakaoScript = document.getElementById('kakao-script');
        if (kakaoScript) return;
        if (!position) return;

        const script = document.createElement('script');
        script.id = 'kakao-map';
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_ID}&autoload=false`;

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
            setIsLoading(false);
        };

        script.addEventListener('load', onLoadKakaoMap);

        return () => script.removeEventListener('load', onLoadKakaoMap);
    }, [position]);

    return (
        <>
            <div
                id="map"
                style={{
                    width: '100vw',
                    height: `calc(100vh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT} - ${WALK_INFO_HEIGHT} )`,
                }}
            >
                {isLoading && <div>isLoading</div>}
            </div>
        </>
    );
}
