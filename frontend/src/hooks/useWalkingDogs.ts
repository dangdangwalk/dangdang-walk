import { DogAvatar, WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { useStore } from '@/store';
import { updateSet } from '@/utils/check';
import { useState } from 'react';

export type FecesAndUrine = 'urine' | 'feces';
const useWalkingDogs = () => {
    const walkingDogs = useStore((state) => state.walkingDogs);
    const setWalkingDogs = useStore((state) => state.setWalkingDogs);
    const updateDogs = useStore((state) => state.updateWalkingDogs);
    const [fecesCheckedList, setFecesCheckedList] = useState<Set<number>>(new Set<number>());
    const [urineCheckedList, setUrineCheckedList] = useState<Set<number>>(new Set<number>());

    const saveFecesAndUrine = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;

        updateDogs((prevWalkingDogs: WalkingDog[]) =>
            prevWalkingDogs.map((dog: WalkingDog) => ({
                ...dog,
                fecesLocations: fecesCheckedList.has(dog.id) ? [...dog.fecesLocations, [lat, lng]] : dog.fecesLocations,
                urineLocations: urineCheckedList.has(dog.id) ? [...dog.urineLocations, [lat, lng]] : dog.urineLocations,
            }))
        );
        cancelCheckedAll();
    };

    const cancelCheckedAll = () => {
        setFecesCheckedList(new Set<number>());
        setUrineCheckedList(new Set<number>());
    };

    const handleToggle = (id: number, key: FecesAndUrine) => {
        if (key === 'feces') {
            setFecesCheckedList((prev) => updateSet(prev, id));
        } else {
            setUrineCheckedList((prev) => updateSet(prev, id));
        }
    };

    const initialSetDogs = (dogs: WalkingDog[] | DogAvatar[]) => {
        setWalkingDogs(
            dogs.map((dog) => {
                return {
                    ...dog,
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
        fecesCheckedList,
        urineCheckedList,
    };
};

export default useWalkingDogs;
