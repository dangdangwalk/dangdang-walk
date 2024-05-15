import { WalkingDog } from '@/models/dog.model';
import { Position } from '@/models/location.model';
import { useEffect, useState } from 'react';

const useWalkingDogs = () => {
    const [walkingDogs, setWalkingDogs] = useState<WalkingDog[] | null>(null);

    const toggleUrineCheck = (id: number) => {
        if (!walkingDogs) return;
        setWalkingDogs(
            walkingDogs.map((d: WalkingDog) =>
                d.id === id
                    ? {
                          ...d,
                          isUrineChecked: !d.isUrineChecked,
                      }
                    : d
            )
        );
    };
    const toggleFeceCheck = (id: number) => {
        if (!walkingDogs) return;
        setWalkingDogs(
            walkingDogs.map((d: any) =>
                d.id === id
                    ? {
                          ...d,
                          isFeceChecked: !d.isFeceChecked,
                      }
                    : d
            )
        );
    };
    const saveFecesAndUriens = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;
        const updatedDogs = walkingDogs.map((dog: WalkingDog) => ({
            ...dog,
            fecesLocations: dog.isFeceChecked ? [...dog.fecesLocations, { lat, lng }] : dog.fecesLocations,
            urineLocations: dog.isUrineChecked ? [...dog.urineLocations, { lat, lng }] : dog.urineLocations,
            isFeceChecked: false,
            isUrineChecked: false,
            ags: 'dogs',
        }));
        console.log('update : ', updatedDogs);
        setWalkingDogs(updatedDogs);
    };

    useEffect(() => {
        console.log('walk : ', walkingDogs);
    }, [walkingDogs]);

    const cancelCheckedAll = () => {
        if (!walkingDogs) return;
        setWalkingDogs(
            walkingDogs.map((d: WalkingDog) => {
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
                    fecesLocations: d.fecesLocations ? d.fecesLocations : [],
                    urineLocations: d.urineLocations ? d.urineLocations : [],
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
        cancelCheckedAll,
        setDogs,
    };
};

export default useWalkingDogs;
