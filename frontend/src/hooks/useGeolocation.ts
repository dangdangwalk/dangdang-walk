import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Position } from '@/models/location.model';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

const useGeolocation = (isUseWatch: boolean = false) => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);
    const [routes, setRoutes] = useState<Position[]>([]);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                setStartPosition({ lat: latitude, lng: longitude });
                if (isUseWatch) {
                    setPrevPosition({ lat: latitude, lng: longitude });
                }
            });
        } else {
            console.log('no geolocation');
            setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        }
    }, []);

    useEffect(() => {
        if (!startPosition && !isUseWatch) return;

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
            setRoutes([...routes, { lat: latitude, lng: longitude }]);
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startPosition]);

    useEffect(() => {
        if (!startPosition || !currentPosition || !prevPosition) return;

        const newDistance = calculateDistance(
            prevPosition.lat,
            prevPosition.lng,
            currentPosition.lat,
            currentPosition.lng
        );
        setPrevPosition({
            lat: currentPosition.lat,
            lng: currentPosition.lng,
        });
        setDistance(distance + newDistance);
    }, [startPosition, currentPosition]);

    return { position: startPosition, distance, routes, currentPosition };
};

export default useGeolocation;
