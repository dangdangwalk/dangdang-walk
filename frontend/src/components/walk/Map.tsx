import Spinner from '@/components/commons/Spinner';
import { NAV_HEIGHT, TOP_BAR_HEIGHT, WALK_INFO_HEIGHT, DEFAULT_LAT, DEFAULT_LNG } from '@/constants';
import { Coords, Position } from '@/models/location';
import { cn } from '@/utils/tailwindClass';
import { useEffect, useState } from 'react';

const { REACT_APP_KAKAO_MAP_ID: KAKAO_MAP_ID = '' } = window._ENV ?? process.env;

interface MapProps {
    startPosition: Position | null | undefined;
    path: Coords[];
    className?: string;
    height?: string;
}

export default function Map({ startPosition, path, className, height }: MapProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [map, setMap] = useState<any>(null);
    const [polyline, setPolyline] = useState<any>(null);

    const onLoadKakaoMap = () => {
        window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(
                    startPosition?.lat ?? DEFAULT_LAT,
                    startPosition?.lng ?? DEFAULT_LNG
                ),
            };
            const map = new window.kakao.maps.Map(container, options);
            const polyline = new window.kakao.maps.Polyline({
                strokeWeight: 5, // 선의 두께 입니다
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
        const kakaoScript = document.getElementById('kakao-map');
        if (!startPosition) return;
        if (kakaoScript) {
            onLoadKakaoMap();
            return;
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
        if (!map || !path.length) return;
        polyline.setPath(path.map((coords) => new window.kakao.maps.LatLng(coords[0], coords[1])));
    }, [path, map]);
    return (
        <>
            <div
                id="map"
                className={cn(`100vdw ${className}`)}
                style={{
                    height: height
                        ? height
                        : `calc(100dvh - ${NAV_HEIGHT} - ${TOP_BAR_HEIGHT} - ${WALK_INFO_HEIGHT} - 16px )`,
                }}
            >
                {isLoading && <Spinner />}
            </div>
        </>
    );
}
