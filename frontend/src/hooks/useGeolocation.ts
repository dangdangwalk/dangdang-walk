import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [position, setPosition] = useState({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
    });

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setPosition({
                    lat: latitude,
                    lng: longitude,
                });
            });
        }
    });

    return position;
};

export default useGeolocation;
