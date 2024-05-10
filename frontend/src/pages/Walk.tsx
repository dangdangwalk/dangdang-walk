import WalkInfo from '@/components/walk/WalkInfo';
import Map from '@/components/walk/Map';
import WalkNavbar from '@/components/walk/WalkNavbar';
import WalkHeader from '@/components/walk/WalkHeader';
import { useWalkStore } from '@/store/walkStore';
import { useEffect, useState } from 'react';
import Avatar from '@/components/common/Avatar';
import { Divider } from '@/components/common/Divider';
import useGeolocation from '@/hooks/useGeolocation';
import BottomSheet from '@/components/common/BottomSheet';

export default function Walk() {
    const { position } = useGeolocation();
    // const [isWalk, setIsWalk] = useState<boolean>(false);
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    console.log(position);
    const { isWalk, increaseDuration, walkStop, distance, duration, calories, setCalories, walkStart, walkingDogs } =
        useWalkStore();

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isWalk) {
            intervalId = setInterval(() => {
                increaseDuration();
                setCalories();
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isWalk, duration]);

    const handleWalkStop = () => {
        if (isWalk) {
            walkStop();
        }
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
    useEffect(() => {
        walkStart(new Date());
    }, []);
    return (
        <>
            <WalkHeader />
            <WalkInfo duration={duration} calories={calories} distance={distance} />

            <Map />
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
                                <div></div>

                                {/* <Checkbox id={String(dog.id)} checked={dog.isUrineChecked} /> */}
                                {/* <DogCheckBox id={dog.id} isChecked={dog.isChecked} onChange={handleDogSelect} /> */}
                            </li>
                        </>
                    ))}
                </BottomSheet.Body>
                <BottomSheet.Footer>산책하기</BottomSheet.Footer>
            </BottomSheet>
        </>
    );
}
