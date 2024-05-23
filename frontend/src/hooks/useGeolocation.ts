import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Position } from '@/models/location.model';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

//TODO: 위치저장 localstorage 정장 로직 확인 필요
const useGeolocation = () => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);
    const [routes, setRoutes] = useState<Position[]>([]);
    const [isStartGeo, setIsStartGeo] = useState<boolean>(false);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                setStartPosition({ lat: latitude, lng: longitude });
                setPrevPosition({ lat: latitude, lng: longitude });
            });
        } else {
            console.log('no geolocation');
            setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        }
    }, []);

    useEffect(() => {
        if (!startPosition || !isStartGeo) return;
        const watchId = navigator.geolocation.watchPosition((position) => {
            if (!isStartGeo) return;
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

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
    useEffect(() => {
        if (!startPosition || !currentPosition || !prevPosition) return;
        const { lat, lng } = currentPosition;
        console.log(currentPosition, prevPosition);
        const newDistance = calculateDistance(prevPosition.lat, prevPosition.lng, lat, lng);
        setRoutes([...routes, { lat, lng }]);
        setPrevPosition({ lat, lng });
        setDistance(distance + newDistance);
    }, [startPosition, currentPosition]);

    return { position: startPosition, distance, routes, currentPosition, stopGeo, startGeo };
};

export default useGeolocation;
