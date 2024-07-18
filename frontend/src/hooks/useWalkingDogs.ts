import { DogAvatar, WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { useStore } from '@/store';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';

const useWalkingDogs = () => {
    const walkingDogs = useStore((state) => state.walkingDogs);
    const setWalkingDogs = useStore((state) => state.setWalkingDogs);
    const updateDogs = useStore((state) => state.updateWalkingDogs);

    const saveFecesAndUrine = (position: Position | null) => {
        if (!position || !walkingDogs) return;
        const { lat, lng } = position;

        updateDogs((prevWalkingDogs: WalkingDog[]) =>
            prevWalkingDogs.map((dog: WalkingDog) => ({
                ...dog,
                fecesLocations: dog.isFecesChecked ? [...dog.fecesLocations, [lat, lng]] : dog.fecesLocations,
                urineLocations: dog.isUrineChecked ? [...dog.urineLocations, [lat, lng]] : dog.urineLocations,
                isFecesChecked: false,
                isUrineChecked: false,
            }))
        );
    };

    const cancelCheckedAll = () => {
        updateDogs((prevWalkingDogs: WalkingDog[]) =>
            setFlagValueByKey(prevWalkingDogs, false, 'isFecesChecked', 'isUrineChecked')
        );
    };

    const handleToggle = (id: number, key: keyof WalkingDog) => {
        updateDogs((prevWalkingDogs: WalkingDog[]) => toggleCheckById(prevWalkingDogs, id, key));
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
