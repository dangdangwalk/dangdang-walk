import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants';
import { Position } from '@/models/location';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

const useGeolocation = () => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [routes, setRoutes] = useState<Position[]>([]);
    const [isStartGeo, setIsStartGeo] = useState<boolean>(false);
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    setStartPosition({ lat, lng });
                    setPrevPosition({ lat, lng });
                    setRoutes([...routes, { lat, lng }]);
                },
                (error) => {
                    console.log(error);
                    setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
                }
            );
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
            setCurrentPosition({ lat, lng });
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
    useEffect(() => {
        if (!prevPosition || !currentPosition) return;
        const { lat, lng } = currentPosition;
        setDistance((prevDistance) => {
            const newDistance = calculateDistance(prevPosition.lat, prevPosition.lng, lat, lng);
            return prevDistance + Math.floor(newDistance) / 10;
        });
        setRoutes((prevRoutes) => [...prevRoutes, { lat, lng }]);
        setPrevPosition({ lat, lng });
    }, [currentPosition]);
    return { position: startPosition, distance, routes, currentPosition, stopGeo, startGeo };
};

export default useGeolocation;
