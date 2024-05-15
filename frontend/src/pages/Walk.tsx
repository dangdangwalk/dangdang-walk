import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useEffect, useRef, useState } from 'react';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/common/BottomSheet';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import useStopWatch from '@/hooks/useStopWatch';
import { DEFAULT_WALK_MET, DEFAULT_WEIGHT } from '@/constants/walk';

import DogFeceAndUrineCheckList from '@/components/walk/DogFeceAndUrineCheckList';
import StopToast from '@/components/walk/StopToast';
import { useLocation } from 'react-router-dom';
import useToast from '@/hooks/useToast';

export default function Walk() {
    const location = useLocation();
    const dogData = location.state;
    const { distance, position: startPosition, currentPosition, stopGeo, routes } = useGeolocation(true);
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const { walkingDogs, toggleFeceCheck, toggleUrineCheck, saveFecesAndUriens, cancelFecesAndUriens } =
        useWalkingDogs(dogData);
    const [calories, setCalories] = useState<number>(0);
    const { duration, isStart: isWalk, stopClock, startClock } = useStopWatch();
    const timeoutRef = useRef<number | null>(null);
    const [isShowStopAlert, setIsShowStopAlert] = useState<boolean>(false);
    const { show } = useToast();

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
        if (isDogBottomsheetOpen) {
            cancelFecesAndUriens();
        }
    };

    const handleWalkStart = (date: Date) => {
        startClock(date);
        stopGeo();
    };
    const showAlert = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsShowStopAlert(true);
        timeoutRef.current = window.setTimeout(() => {
            setIsShowStopAlert(false);
        }, 1000);
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
            showAlert();
        }
    };
    const handleConfirm = () => {
        saveFecesAndUriens(currentPosition);
        handleBottomSheet();
        show('용변기록이 저장되었습니다 :)');
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

            <Map startPosition={startPosition} path={routes} />

            <StopToast isVisible={isShowStopAlert} />
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
