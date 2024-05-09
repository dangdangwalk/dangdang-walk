import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants/location';
import { Position } from '@/models/location.model';
import { useEffect, useState } from 'react';

const useGeolocation = () => {
    const [position, setPosition] = useState<Position | null>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                console.log('position');
                setPosition({ lat: latitude, lng: longitude });
            });
        } else {
            console.log('no geolocation');
            setPosition({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        }
    }, []);

    return { position };
};

export default useGeolocation;
