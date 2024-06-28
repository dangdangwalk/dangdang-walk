import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants';
import { Position } from '@/models/location';
import { useStore } from '@/store';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

const useGeolocation = () => {
    const addRoutes = useStore((state) => state.addRoutes);
    const setRoutes = useStore((state) => state.setRoutes);
    const routes = useStore((state) => state.routes);
    const distance = useStore((state) => state.distance);
    const setDistance = useStore((state) => state.setDistance);
    const addDistance = useStore((state) => state.addDistance);

    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [isStartGeo, setIsStartGeo] = useState<boolean>(false);
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);
    const [isLocationDisabled, setIsLocationDisabled] = useState<boolean>(false);

    useEffect(() => {
        const onSuccess = (position: GeolocationPosition) => {
            const { latitude: lat, longitude: lng } = position.coords;
            setStartPosition({ lat, lng });
        };
        const onError = (error: GeolocationPositionError) => {
            setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
            setIsLocationDisabled(true);
        };

        if (navigator?.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            setStartPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
            setIsLocationDisabled(true);
        }
    }, []);

    useEffect(() => {
        if (!startPosition || !isStartGeo || !navigator.geolocation) return;
        const onSuccess = (position: GeolocationPosition) => {
            if (!isStartGeo) return;
            const { latitude: lat, longitude: lng } = position.coords;
            setCurrentPosition({ lat, lng });
        };

        const onError = (error: GeolocationPositionError) => {};

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startPosition, isStartGeo]);

    const startGeo = (distance: number | undefined, routes: Position[] | undefined) => {
        setDistance(distance ? distance : 0);
        setIsStartGeo(true);

        if (routes?.length) {
            const position: Position = routes[routes.length - 1] as Position;
            setRoutes(routes);
            setPrevPosition(position);
        } else {
            setRoutes([]);
        }
    };

    const stopGeo = () => {
        setIsStartGeo(false);
    };

    useEffect(() => {
        if (!currentPosition) return;
        const { lat, lng } = currentPosition;

        if (prevPosition) {
            const newDistance = calculateDistance(prevPosition.lat, prevPosition.lng, lat, lng);
            addDistance(newDistance);
        }
        addRoutes({ lat, lng });
        setPrevPosition({ lat, lng });
    }, [currentPosition]);

    return {
        position: startPosition,
        distance,
        routes,
        currentPosition,
        stopGeo,
        startGeo,
        isLocationDisabled,
        isStartGeo,
        setCurrentPosition,
    };
};

export default useGeolocation;
