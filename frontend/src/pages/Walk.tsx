import BottomSheet from '@/components/commons/BottomSheet';
import Map from '@/components/walk/Map';
import WalkHeader from '@/components/walk/WalkHeader';
import WalkInfo from '@/components/walk/WalkInfo';
import WalkNavbar from '@/components/walk/WalkNavbar';
import useGeolocation from '@/hooks/useGeolocation';
import useStopWatch from '@/hooks/useStopWatch';
import useWalkingDogs from '@/hooks/useWalkingDogs';
import { FormEvent, useEffect, useState } from 'react';
import { requestWalkStart, requestWalkStop } from '@/api/walk';
import DogFecesAndUrineCheckList from '@/components/walk/DogFecesAndUrineCheckList';
import StopToast from '@/components/walk/StopToast';
import useAlertToast from '@/hooks/useAlertToast';
import useToast from '@/hooks/useToast';
import { DogAvatar, WalkingDog } from '@/models/dog';
import { Coords } from '@/models/location';
import { useStore } from '@/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadImages } from '@/utils/image';
import { delay } from 'msw';
import { DEFAULT_WEIGHT, WALKING_FACTOR } from '@/constants';

export interface DogWalkData {
    dogs: WalkingDog[] | DogAvatar[];
    startedAt: string | undefined;
    distance: number | undefined;
    routes: Coords[] | undefined;
    journalPhotos: string[] | undefined;
}
export interface JournalCreateFromState extends DogWalkData {
    calories: number;
}
function Walk() {
    const location = useLocation();
    const navigate = useNavigate();

    const { walkingDogs, saveFecesAndUrine, initialSetDogs, handleToggle, cancelCheckedAll } = useWalkingDogs();
    const { duration, isStart: isWalk, stopClock, startClock, startedAt } = useStopWatch();
    const { distance, position: startPosition, currentPosition, stopGeo, routes, startGeo } = useGeolocation();
    const [isDogBottomSheetOpen, setIsDogBottomSheetOpen] = useState<boolean>(false);
    const { showAlertToast: showStopAlert, isShowAlert: isShowStopAlert } = useAlertToast();
    const { show: showToast } = useToast();
    const spinnerAdd = useStore((state) => state.spinnerAdd);
    const spinnerRemove = useStore((state) => state.spinnerRemove);
    const journalPhotos = useStore((state) => state.journalPhotos);
    const setJournalPhotos = useStore((state) => state.setJournalPhotos);
    const resetWalkData = useStore((state) => state.resetWalkData);
    const handleBottomSheet = () => {
        setIsDogBottomSheetOpen(!isDogBottomSheetOpen);
        if (isDogBottomSheetOpen) {
            cancelCheckedAll();
        }
    };

    const handleConfirm = () => {
        saveFecesAndUrine(currentPosition);
        setIsDogBottomSheetOpen(false);
        showToast('용변기록이 저장되었습니다 :)');
    };

    const stopWalk = async (dogs: WalkingDog[]) => {
        if (!dogs.length) return;
        let routeToSave;

        spinnerAdd();
        stopClock();
        const [stopGeoResult] = await Promise.allSettled([stopGeo(), requestWalkStop(dogs.map((d) => d.id))]);

        if (stopGeoResult.status === 'fulfilled') {
            routeToSave = stopGeoResult.value;
        } else {
            routeToSave = routes;
        }

        resetWalkData();
        await delay(400);
        navigate('/journals/create', {
            state: {
                dogs,
                distance,
                duration,
                calories: getCalories(distance),
                startedAt,
                routes: routeToSave,
                journalPhotos,
            },
        });

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
    const handleWalkStart = (dogs: WalkingDog[] | DogAvatar[]) => {
        initialSetDogs(dogs);
        startClock();
        startGeo();
    };
    const getCalories = (distance: number) => Math.floor((distance / 1000) * DEFAULT_WEIGHT * WALKING_FACTOR);

    const handleAddImages = async (e: FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files === null) return;

        const filenames = await uploadImages(files);
        setJournalPhotos(filenames);
        showToast('사진이 저장되었습니다 :)');
    };

    useEffect(() => {
        const dogData = location.state as ReceivedState;
        if (!dogData && !walkingDogs.length) {
            navigate('/');
            return;
        }

        const requestDogWalk = async (dogs: DogAvatar[]) => {
            const ok = await requestWalkStart(dogs.map((dog) => dog.id));
            if (ok) {
                handleWalkStart(dogs);
            } else {
                navigate('/');
            }
        };

        if (walkingDogs.length) {
            handleWalkStart(walkingDogs);
        } else {
            requestDogWalk(dogData.dogs);
        }
    }, []);

    return (
        <div className="inset-0 h-dvh overflow-hidden">
            <WalkHeader />
            <WalkInfo duration={duration} calories={getCalories(distance)} distance={distance} />

            <Map startPosition={startPosition} path={routes} />

            <StopToast isVisible={isShowStopAlert} />
            <WalkNavbar onOpen={handleBottomSheet} onStop={handleWalkStop} onChange={handleAddImages} />

            <BottomSheet isOpen={isDogBottomSheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 산책</BottomSheet.Header>
                <BottomSheet.Body>
                    {walkingDogs?.map((dog) => (
                        <DogFecesAndUrineCheckList dog={dog} toggleCheck={handleToggle} key={dog.id} />
                    ))}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={walkingDogs?.find((d) => d.isUrineChecked || d.isFecesChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </div>
    );
}

interface ReceivedState {
    dogs: DogAvatar[];
}

export default Walk;
