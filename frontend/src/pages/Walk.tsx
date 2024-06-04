import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useEffect, useState } from 'react';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/commons/BottomSheet';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import useStopWatch from '@/hooks/useStopWatch';
import { DEFAULT_WALK_MET, DEFAULT_WEIGHT } from '@/constants/walk';

import DogFeceAndUrineCheckList from '@/components/walk/DogFeceAndUrineCheckList';
import StopToast from '@/components/walk/StopToast';
import { useLocation, useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';
import useStopAlert from '@/hooks/useStopAlert';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { storageKeys } from '@/constants';
import { walkStartRequest, walkStopRequest } from '@/api/walk';
import useImageUpload from '@/hooks/useImageUpload';
import { useSpinnerStore } from '@/store/spinnerStore';
import { setFlagValueByKey, toggleCheckById } from '@/utils/check';

export interface DogWalkData {
    dogs: WalkingDog[];
    startedAt: string;
    distance: number;
    routes: Position[];
    photoUrls: string[];
}

export default function Walk() {
    const location = useLocation();
    const navigate = useNavigate();

    const { walkingDogs, saveFecesAndUriens, setDogs, setWalkingDogs } = useWalkingDogs();
    const { duration, isStart: isWalk, stopClock, startClock, startedAt } = useStopWatch();
    const { distance, position: startPosition, currentPosition, stopGeo, routes, startGeo } = useGeolocation();
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);

    const [calories, setCalories] = useState<number>(0);
    const { uploadedImageUrls: photoUrls, handleFileChange, setUploadedImageUrls: setPhotoUrls } = useImageUpload();
    const { showStopAlert, isShowStopAlert } = useStopAlert();
    const { show } = useToast();
    const { spinnerAdd, spinnerRemove } = useSpinnerStore();

    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
        if (isDogBottomsheetOpen) {
            cancelCheckedAll();
        }
    };

    const cancelCheckedAll = () => {
        if (!walkingDogs?.length) return;
        const newWalkingDogs = setFlagValueByKey(walkingDogs, false, 'isFeceChecked', 'isUrineChecked');
        setWalkingDogs(newWalkingDogs);
    };

    const handleToggle = (id: number, key: keyof WalkingDog) => {
        if (!walkingDogs?.length) return;
        const newWalkingDogs = toggleCheckById(walkingDogs, id, key);
        setWalkingDogs(newWalkingDogs);
    };

    const handleConfirm = () => {
        saveFecesAndUriens(currentPosition);
        setIsDogBottomsheetOpen(false);
        show('용변기록이 저장되었습니다 :)');
    };

    const stopWalk = async (dogs: WalkingDog[] | null) => {
        if (!dogs) return;
        spinnerAdd();
        const ok = await walkStopRequest(dogs.map((d) => d.id));
        if (ok) {
            stopClock();
            stopGeo();
            removeStorage(storageKeys.DOGS);
            navigate('/journals/create', {
                state: { dogs, distance, duration, calories, startedAt, routes, photoUrls },
            });
        }
        spinnerRemove();
    };

    const handleWalkStop = (isStop: boolean) => {
        if (!isWalk) return;
        if (isStop) {
            stopWalk(walkingDogs);
        } else {
            showStopAlert();
        }
    };
    const handleWalkStart = (dogData: DogWalkData) => {
        setDogs(dogData.dogs);
        startClock(dogData.startedAt);
        startGeo(dogData.distance, dogData.routes);
        setPhotoUrls(dogData.photoUrls ?? []);
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
            photoUrls: photoUrls,
        };
        setStorage(storageKeys.DOGS, JSON.stringify(walkDogData));
    }, [walkingDogs, startedAt, distance, routes, photoUrls]);

    useEffect(() => {
        const dogData = (
            getStorage(storageKeys.DOGS) ? JSON.parse(getStorage(storageKeys.DOGS) ?? '') : location.state
        ) as DogWalkData;
        if (!dogData) {
            navigate('/');
            return;
        }
        const requstWalkStart = async (data: DogWalkData) => {
            const ok = await walkStartRequest(data.dogs.map((d) => d.id));
            if (ok) {
                handleWalkStart(data);
            } else {
                navigate('/');
                removeStorage(storageKeys.DOGS);
            }
        };
        if (getStorage(storageKeys.DOGS)) {
            handleWalkStart(dogData);
        } else {
            requstWalkStart(dogData);
        }
    }, []);

    return (
        <div className="inset-0 h-dvh overflow-hidden">
            <WalkHeader />
            <WalkInfo duration={duration} calories={calories} distance={distance} />

            <Map startPosition={startPosition} path={routes} />

            <StopToast isVisible={isShowStopAlert} />
            <WalkNavbar onOpen={handleBottomSheet} onStop={handleWalkStop} onChange={handleFileChange} />

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs?.map((dog) => (
                        <DogFeceAndUrineCheckList dog={dog} toggleCheck={handleToggle} key={dog.id} />
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
