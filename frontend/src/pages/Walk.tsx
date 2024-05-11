import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useEffect, useState } from 'react';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/common/BottomSheet';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import useClock from '@/hooks/useClock';
import { DEFAULT_WALK_MET, DEFAULT_WEIGHT } from '@/constants/walk';

import DogFeceAndUrineCheckList from '@/components/walk/DogFeceAndUrineCheckList';

export default function Walk() {
    const { distance, position: startPosition, currentPosition, stopGeo } = useGeolocation();
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const { walkingDogs, toggleFeceCheck, toggleUrineCheck, saveFecesAndUriens } = useWalkingDogs();
    const [calories, setCalories] = useState<number>(0);
    const { duration, isStart: isWalk, stopClock, startClock } = useClock();

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
    };

    const handleWalkStart = (date: Date) => {
        startClock(date);
        stopGeo();
    };
    const handleWalkStop = () => {
        if (isWalk) {
            stopClock();
        }
    };
    const handleConfirm = () => {
        saveFecesAndUriens(currentPosition);
        handleBottomSheet();
    };

    useEffect(() => {
        setCalories(Math.round((DEFAULT_WALK_MET * DEFAULT_WEIGHT * duration) / 3600));
    }, [duration]);

    useEffect(() => {
        handleWalkStart(new Date());
    }, []);

    return (
        <div className="overflow-hidden h-screen inset-0">
            <WalkHeader />
            <WalkInfo duration={duration} calories={calories} distance={distance} />

            <Map position={startPosition} />
            <WalkNavbar onOpen={handleBottomSheet} onStop={handleWalkStop} />

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs.map((dog) => (
                        <DogFeceAndUrineCheckList
                            dog={dog}
                            toggleFeceCheck={toggleFeceCheck}
                            toggleUrineCheck={toggleUrineCheck}
                            key={dog.id}
                        />
                    ))}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={walkingDogs.find((d) => d.isUrineChecked || d.isFeceChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </div>
    );
}
