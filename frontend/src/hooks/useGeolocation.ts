import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Position } from '@/models/location.model';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

//TODO: 위치저장 localstorage 정장 로직 확인 필요
const useGeolocation = () => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [routes, setRoutes] = useState<Position[]>([]);
    const [isStartGeo, setIsStartGeo] = useState<boolean>(false);
    let oldPosition: Position | null = null;

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                setStartPosition({ lat: latitude, lng: longitude });
            });
        } else {
            console.log('no geolocation');
            setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        }
    }, []);

    useEffect(() => {
        if (!startPosition || !isStartGeo) return;
        const onSuccess = (position: GeolocationPosition) => {
            if (!isStartGeo) return;
            const { latitude: lat, longitude: lng } = position.coords;
            if (oldPosition === null) {
                setCurrentPosition({ lat, lng });
                setRoutes([...routes, { lat, lng }]);
                oldPosition = { lat, lng };
            } else {
                const newDistance = calculateDistance(oldPosition.lat, oldPosition.lng, lat, lng);
                if (newDistance < 1) return;
                setRoutes([...routes, { lat, lng }]);
                setCurrentPosition({ lat, lng });
                setDistance(distance + Math.floor(newDistance));
                oldPosition = { lat, lng };
            }
        };

        const onError = (error: GeolocationPositionError) => {
            console.log(error);
        };

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startPosition, isStartGeo]);

    const startGeo = (distance: number | undefined, routes: Position[] | undefined) => {
        setDistance(distance ? distance : 0);
        setRoutes(routes ? routes : []);
        setIsStartGeo(true);
    };

    const stopGeo = () => {
        setIsStartGeo(false);
    };

    return { position: startPosition, distance, routes, currentPosition, stopGeo, startGeo };
};

export default useGeolocation;
