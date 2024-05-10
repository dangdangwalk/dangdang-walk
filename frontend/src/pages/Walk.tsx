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
    const { distance, position: startPosition } = useGeolocation();
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const [startedAt, setStartedAt] = useState<string>('');
    const { walkingDogs } = useWalkingDogs();
    const [calories, setCalories] = useState<number>(0);
    const { duration, isStart: isWalk, setIsStart: setIsWalk } = useClock();

    const setStartTime = (date: Date) => {
        console.log(startedAt);
        localStorage.setItem('startedAt', date.toISOString());
    };

    // const handleDogSelect = (id: number) => {
    //     if (id < 0) {
    //         setAvailableDog(availableDog.map((d: any) => ({ ...d, isChecked: !d.isChecked })));
    //         return;
    //     }
    //     setAvailableDog(availableDog.map((d: any) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d)));
    //     // setAvailableDog([]);
    // };

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
    };

    const handleWalkStart = (date: Date) => {
        setStartTime(date);
        setStartedAt(date.toISOString());
        setIsWalk(true);
    };
    const handleWalkStop = () => {
        if (isWalk) {
            setIsWalk(false);
        }
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

            <BottomSheet
                isOpen={isDogBottomsheetOpen}
                onClose={handleBottomSheet}
                disabled={walkingDogs.find((d) => d.isUrineChecked || d.isFeceChecked) ? false : true}
            >
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs.map((dog) => (
                        <>
                            <Divider key={`${dog.id}-divider`} className="h-0 border border-neutral-200" />
                            <li className="flex py-2 justify-between items-center" key={dog.id}>
                                <Avatar url={dog.photoUrl} name={dog.name} />
                                <div className="flex gap-1">
                                    <Checkbox checked={dog.isFeceChecked} onCheckedChange={() => {}}>
                                        <Feces color={dog.isFeceChecked ? 'primary' : 'secondary'} />
                                    </Checkbox>
                                    <Checkbox checked={dog.isUrineChecked} onCheckedChange={() => {}}>
                                        <Urine color={dog.isUrineChecked ? 'primary' : 'secondary'} />
                                    </Checkbox>
                                </div>
                            </li>
                        </>
                    ))}
                </BottomSheet.Body>
                <BottomSheet.Footer>산책하기</BottomSheet.Footer>
            </BottomSheet>
        </>
    );
}
