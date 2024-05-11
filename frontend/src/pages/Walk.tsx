import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useEffect, useState } from 'react';
import Avatar from '@/components/common/Avatar';
import { Divider } from '@/components/common/Divider';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/common/BottomSheet';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import useClock from '@/hooks/useClock';
import { DEFAULT_WALK_MET, DEFAULT_WEIGHT } from '@/constants/walk';
import { Checkbox } from '@/components/common/Checkbox2';
import { Feces } from '@/components/icon/Feces';
import { Urine } from '@/components/icon/Urine';

export default function Walk() {
    const { distance, position: startPosition, currentPosition } = useGeolocation();
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const { walkingDogs, toggleFeceCheck, toggleUrineCheck, saveFecesAndUriens } = useWalkingDogs();
    const [calories, setCalories] = useState<number>(0);
    const { duration, isStart: isWalk, stopClock, startClock } = useClock();

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
    };

    const handleWalkStart = (date: Date) => {
        startClock(date);
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
        <>
            <WalkHeader />
            <WalkInfo duration={duration} calories={calories} distance={distance} />

            <Map position={startPosition} />
            <WalkNavbar onOpen={handleBottomSheet} onStop={handleWalkStop} />

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs.map((dog) => (
                        <>
                            <Divider key={`${dog.id}-divider`} className="h-0 border border-neutral-200" />
                            <li className="flex py-2 justify-between items-center" key={dog.id}>
                                <Avatar url={dog.photoUrl} name={dog.name} />
                                <div className="flex gap-1">
                                    <Checkbox
                                        checked={dog.isFeceChecked}
                                        onCheckedChange={() => {
                                            toggleFeceCheck(dog.id);
                                        }}
                                    >
                                        <Feces color={dog.isFeceChecked ? 'primary' : 'secondary'} />
                                    </Checkbox>
                                    <Checkbox
                                        checked={dog.isUrineChecked}
                                        onCheckedChange={() => {
                                            toggleUrineCheck(dog.id);
                                        }}
                                    >
                                        <Urine color={dog.isUrineChecked ? 'primary' : 'secondary'} />
                                    </Checkbox>
                                </div>
                            </li>
                        </>
                    ))}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={walkingDogs.find((d) => d.isUrineChecked || d.isFeceChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </>
    );
}
