import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useEffect, useState } from 'react';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/common/BottomSheet';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import useStopWatch from '@/hooks/useStopWatch';
import { DEFAULT_WALK_MET, DEFAULT_WEIGHT } from '@/constants/walk';

import DogFeceAndUrineCheckList from '@/components/walk/DogFeceAndUrineCheckList';
import StopToast from '@/components/walk/StopToast';
import { useLocation, useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';
import useStopAlert from '@/hooks/useStopAlert';
import { getStorage, setStorage } from '@/utils/storage';
import { WalkingDog } from '@/models/dog.model';
import { Position } from '@/models/location.model';

interface DogWalkData {
    dogs: WalkingDog[];
    startedAt: string;
    distance: number;
    routes: Position[];
}

export default function Walk() {
    const location = useLocation();
    const navigate = useNavigate();

    const { walkingDogs, toggleFeceCheck, toggleUrineCheck, saveFecesAndUriens, cancelCheckedAll, setDogs } =
        useWalkingDogs();

    const { duration, isStart: isWalk, stopClock, startClock, startedAt } = useStopWatch();
    const { distance, position: startPosition, currentPosition, stopGeo, routes, startGeo } = useGeolocation();
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);

    const [calories, setCalories] = useState<number>(0);

    const { showStopAlert, isShowStopAlert } = useStopAlert();
    const { show } = useToast();

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
        if (isDogBottomsheetOpen) {
            cancelCheckedAll();
        }
    };

    const handleConfirm = () => {
        saveFecesAndUriens(currentPosition);
        setIsDogBottomsheetOpen(false);
        show('용변기록이 저장되었습니다 :)');
    };

    const stopWalk = () => {
        stopClock();
        stopGeo();
    };

    const handleWalkStop = (isStop: boolean) => {
        if (!isWalk) return;
        if (isStop) {
            stopWalk();
        } else {
            showStopAlert();
        }
    };

    useEffect(() => {
        setCalories(Math.round((DEFAULT_WALK_MET * DEFAULT_WEIGHT * duration) / 3600));
    }, [duration]);

    useEffect(() => {
        if (!routes || !startedAt || !walkingDogs) return;
        const walkDogData: DogWalkData = {
            dogs: walkingDogs,
            startedAt: startedAt,
            distance: distance,
            routes: routes,
        };
        setStorage('dogs', JSON.stringify(walkDogData));
    }, [walkingDogs]);

    useEffect(() => {
        const dogData = (getStorage('dogs') ? JSON.parse(getStorage('dogs') ?? '') : location.state) as DogWalkData;
        if (!dogData) {
            navigate('/');
            return;
        }
        setDogs(dogData.dogs);
        startClock(dogData.startedAt);
        startGeo(dogData.distance, dogData.routes);
    }, []);

    return (
        <div className="overflow-hidden h-screen inset-0">
            <WalkHeader />
            <WalkInfo duration={duration} calories={calories} distance={distance} />

            <Map startPosition={startPosition} path={routes} />

            <StopToast isVisible={isShowStopAlert} />
            <WalkNavbar onOpen={handleBottomSheet} onStop={handleWalkStop} />

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs?.map((dog) => (
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
                    disabled={walkingDogs?.find((d) => d.isUrineChecked || d.isFeceChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </div>
    );
}
