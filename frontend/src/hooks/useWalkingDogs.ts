import { WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { useState } from 'react';

const useWalkingDogs = () => {
    const [walkingDogs, setWalkingDogs] = useState<WalkingDog[] | null>(null);

    const saveFecesAndUriens = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;
        const updatedDogs = walkingDogs.map((dog: WalkingDog) => ({
            ...dog,
            fecesLocations: dog.isFecesChecked ? [...dog.fecesLocations, { lat, lng }] : dog.fecesLocations,
            urineLocations: dog.isUrineChecked ? [...dog.urineLocations, { lat, lng }] : dog.urineLocations,
            isFeceChecked: false,
            isUrineChecked: false,
        }));
        setWalkingDogs(updatedDogs);
    };

    const setDogs = (dogs: WalkingDog[]) => {
        setWalkingDogs(
            dogs.map((d) => {
                return {
                    ...d,
                    isFeceChecked: false,
                    isUrineChecked: false,
                    fecesLocations: d.fecesLocations ? d.fecesLocations : [],
                    urineLocations: d.urineLocations ? d.urineLocations : [],
                };
            })
        );
    };

    return {
        walkingDogs,
        setWalkingDogs,
        saveFecesAndUriens,
        setDogs,
    };
};

export default useWalkingDogs;
