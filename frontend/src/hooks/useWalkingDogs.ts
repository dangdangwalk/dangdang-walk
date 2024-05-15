import { WalkingDog } from '@/models/dog.model';
import { Position } from '@/models/location.model';
import { useState } from 'react';

const useWalkingDogs = () => {
    const [walkingDogs, setWalkingDogs] = useState<WalkingDog[] | null>(null);

    const toggleUrineCheck = (id: number) => {
        if (!walkingDogs) return;
        setWalkingDogs(
            walkingDogs.map((d: WalkingDog) => (d.id === id ? { ...d, isUrineChecked: !d.isUrineChecked } : d))
        );
    };
    const toggleFeceCheck = (id: number) => {
        if (!walkingDogs) return;
        setWalkingDogs(walkingDogs?.map((d: any) => (d.id === id ? { ...d, isFeceChecked: !d.isFeceChecked } : d)));
    };
    const saveFecesAndUriens = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;
        setWalkingDogs(
            walkingDogs?.map((d: WalkingDog) => {
                return {
                    ...d,
                    isFeceChecked: false,
                    isUrineChecked: false,
                    fecesLocations: d.isFeceChecked ? [...d.fecesLocations, { lat, lng }] : d.fecesLocations,
                    urineLocations: d.isUrineChecked ? [...d.urineLocations, { lat: lat, lng: lng }] : d.urineLocations,
                };
            })
        );
    };
    const cancelFecesAndUriens = () => {
        if (!walkingDogs) return;
        setWalkingDogs(
            walkingDogs?.map((d: WalkingDog) => {
                return {
                    ...d,
                    isFeceChecked: false,
                    isUrineChecked: false,
                };
            })
        );
    };
    const setDogs = (dogs: WalkingDog[]) => {
        setWalkingDogs(
            dogs.map((d) => {
                return {
                    ...d,
                    isFeceChecked: false,
                    isUrineChecked: false,
                    fecesLocations: d.urineLocations ? d.urineLocations : [],
                    urineLocations: d.fecesLocations ? d.fecesLocations : [],
                };
            })
        );
    };

    return {
        walkingDogs,
        setWalkingDogs,
        toggleFeceCheck,
        toggleUrineCheck,
        saveFecesAndUriens,
        cancelFecesAndUriens,
        setDogs,
    };
};

export default useWalkingDogs;
