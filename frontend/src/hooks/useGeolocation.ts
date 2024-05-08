import { Position } from '@/models/location.model';
import { calculateDistance } from '@/utils/geo';
import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distance, setDistance] = useState<number>(0);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setStartPosition({
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
            console.log('changed position', position.coords);
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startPosition]);

    useEffect(() => {
        if (!startPosition || !currentPosition) return;

        const distanceInMeters = calculateDistance(
            startPosition.lat,
            startPosition.lng,
            currentPosition.lat,
            currentPosition.lng
        );

        setDistance(distanceInMeters);
    }, [startPosition, currentPosition]);

    return { startPosition, currentPosition, distance };
};

export default useGeolocation;
