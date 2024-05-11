import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Position } from '@/models/location.model';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

//TODO: 위치저장 localstorage 정장 로직 확인 필요
const useGeolocation = (isUseWatch: boolean = false) => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);
    const [routes, setRoutes] = useState<Position[]>([]);
    const [isStart, setIsStart] = useState<boolean>(false);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                setStartPosition({ lat: latitude, lng: longitude });
                if (isUseWatch) {
                    setPrevPosition({ lat: latitude, lng: longitude });
                    setIsStart(true);
                    getSavedData();
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
            if (!isStart) return;
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startPosition]);
    const getSavedData = () => {
        const savedDistance = localStorage.getItem('distance');
        const savedRoutes = localStorage.getItem('routes');
        const savedCurrentPosition = localStorage.getItem('currentPosition');
        if (savedDistance && savedRoutes && savedCurrentPosition) {
            setDistance(Number(savedDistance));
            setRoutes(JSON.parse(savedRoutes));
            setCurrentPosition(JSON.parse(savedCurrentPosition));
        }
    };

    const saveCurrentData = (distance: number, currentPosition: Position, routes: Position[]) => {
        localStorage.setItem('distance', distance.toString());
        localStorage.setItem('routes', JSON.stringify(routes));
        localStorage.setItem('currentPosition', JSON.stringify(currentPosition));
    };
    const removeCurrentData = () => {
        localStorage.removeItem('distance');
        localStorage.removeItem('routes');
        localStorage.removeItem('currentPosition');
    };

    const stopGeo = () => {
        setIsStart(false);
        removeCurrentData();
    };
    useEffect(() => {
        if (!startPosition || !currentPosition || !prevPosition) return;
        const { lat, lng } = currentPosition;
        const newDistance = calculateDistance(prevPosition.lat, prevPosition.lng, lat, lng);
        setRoutes([...routes, { lat, lng }]);
        setPrevPosition({ lat, lng });
        setDistance(distance + newDistance);
        saveCurrentData(distance, currentPosition, routes);
    }, [startPosition, currentPosition]);

    return { position: startPosition, distance, routes, currentPosition, stopGeo };
};

export default useGeolocation;
