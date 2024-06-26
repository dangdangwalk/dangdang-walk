import { DogAvatar, WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';
import { useState } from 'react';

const useWalkingDogs = () => {
    const [walkingDogs, setWalkingDogs] = useState<WalkingDog[] | null>(null);

    const saveFecesAndUrine = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;

        setWalkingDogs((prevWalkingDogs) =>
            prevWalkingDogs?.length
                ? prevWalkingDogs.map((dog: WalkingDog) => ({
                      ...dog,
                      fecesLocations: dog.isFecesChecked ? [...dog.fecesLocations, { lat, lng }] : dog.fecesLocations,
                      urineLocations: dog.isUrineChecked ? [...dog.urineLocations, { lat, lng }] : dog.urineLocations,
                      isFecesChecked: false,
                      isUrineChecked: false,
                  }))
                : prevWalkingDogs
        );
    };

    const cancelCheckedAll = () => {
        setWalkingDogs((prevWalkingDogs) =>
            prevWalkingDogs?.length
                ? setFlagValueByKey(prevWalkingDogs, false, 'isFecesChecked', 'isUrineChecked')
                : prevWalkingDogs
        );
    };

    const handleToggle = (id: number, key: keyof WalkingDog) => {
        setWalkingDogs((prevWalkingDogs) =>
            prevWalkingDogs?.length ? toggleCheckById(prevWalkingDogs, id, key) : prevWalkingDogs
        );
    };

    const initialSetDogs = (dogs: WalkingDog[] | DogAvatar[]) => {
        setWalkingDogs(
            dogs.map((dog) => {
                return {
                    ...dog,
                    isFecesChecked: false,
                    isUrineChecked: false,
                    fecesLocations: (dog as WalkingDog).fecesLocations || [],
                    urineLocations: (dog as WalkingDog).urineLocations || [],
                };
            })
        );
    };

    return {
        walkingDogs,
        saveFecesAndUrine,
        initialSetDogs,
        handleToggle,
        cancelCheckedAll,
    };
};

export default useWalkingDogs;
