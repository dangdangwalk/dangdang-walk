import { Position } from '@/models/location.model';
import { useWalkStore } from '@/store/walkStore';
import { calculateDistance } from '@/utils/geo';
import { useEffect, useState } from 'react';

const useGeolocation = () => {
    const { increaseDistance, addRoutes, startPosition, setStartPosition, currentPosition, setCurrentPosition } =
        useWalkStore();
    const [prevPosition, setPrevPosition] = useState<Position | null>(null);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setStartPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setPrevPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        if (!startPosition) return;

        const watchId = navigator.geolocation.watchPosition((position) => {
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
            addRoutes({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
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
        increaseDistance(newDistance);
    }, [startPosition, currentPosition]);

    return { position: currentPosition };
};

export default useGeolocation;
