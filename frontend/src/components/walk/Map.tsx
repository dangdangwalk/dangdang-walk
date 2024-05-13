import { NAV_HEIGHT, TOP_BAR_HEIGHT, WALK_INFO_HEIGHT } from '@/constants/style';
import { Position } from '@/models/location.model';
import React, { useEffect, useState } from 'react';

const { REACT_APP_KAKAO_MAP_ID: KAKAO_MAP_ID = '' } = window._ENV ?? process.env;

interface MapProps {
    startPosition: Position | null;
    path: Position[];
}

declare global {
    interface Window {
        kakao: any;
    }
}

export default function Map({ startPosition, path }: MapProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [map, setMap] = useState<any>(null);
    const [polyline, setPolyline] = useState<any>(null);

    const onLoadKakaoMap = () => {
        window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(startPosition?.lat, startPosition?.lng),
            };
            const map = new window.kakao.maps.Map(container, options);

            const polyline = new window.kakao.maps.Polyline({
                strokeWeight: 3, // 선의 두께 입니다
                strokeColor: '#E42208', // 선의 색깔입니다
                strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'solid', // 선의 스타일입니다
            });

            setPolyline(polyline);
            setMap(map);
            polyline.setMap(map);
        });
        setIsLoading(false);
    };

    useEffect(() => {
        const kakaoScript = document.getElementById('kakao-script');
        if (!startPosition) return;
        if (kakaoScript) {
            onLoadKakaoMap();
        }

        const script = document.createElement('script');
        script.id = 'kakao-map';
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_ID}&autoload=false`;

        document.head.appendChild(script);

        script.addEventListener('load', onLoadKakaoMap);

        return () => script.removeEventListener('load', onLoadKakaoMap);
    }, [startPosition]);

    useEffect(() => {
        if (!map || !startPosition || !path.length) return;
        polyline.setPath(path.map((position) => new window.kakao.maps.LatLng(position.lat, position.lng)));
        const lastPostion = path[path.length - 1];
        map.setCenter(new window.kakao.maps.LatLng(lastPostion?.lat, lastPostion?.lng));
    }, [path]);
    return (
        <>
            <div
                id="map"
                style={{
                    width: '100vw',
                    height: `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT} - ${WALK_INFO_HEIGHT} - 16px )`,
                }}
            >
                {isLoading && <div>isLoading</div>}
            </div>
        </>
    );
}
