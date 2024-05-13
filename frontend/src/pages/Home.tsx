import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';
import Notification from '@/assets/icons/notification.svg';
import Topbar from '@/components/common/Topbar';
import BottomSheet from '@/components/common/BottomSheet';
import { Dog } from '@/models/dog.model';
import AvailableDogCheckList from '@/components/home/AvailableDogCheckList';
import useDogStatistic from '@/hooks/useDogStatistic';

export interface AvailableDog extends Dog {
    isChecked: boolean;
}
const aDogs: AvailableDog[] = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        isChecked: false,
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        isChecked: false, // 한 주간 산책 체크
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        isChecked: false,
    },
];
function Home() {
    const [isDogBottomsheetOpen, setIsDogBottomsheetOpen] = useState<boolean>(false);
    const [availableDogs, setAvailableDogs] = useState<AvailableDog[]>(aDogs);
    const { dogs, isDogsLoading } = useDogStatistic();

    const cancelSelectDogs = () => {
        setAvailableDogs(
            availableDogs.map((d: AvailableDog) => {
                return {
                    ...d,
                    isChecked: false,
                };
            })
        );
    };
    const handleBottomSheet = () => {
        setIsDogBottomsheetOpen(!isDogBottomsheetOpen);
        if (isDogBottomsheetOpen) {
            cancelSelectDogs();
        }
    };
    const handleToggle = (id: number) => {
        setAvailableDogs(availableDogs.map((d: AvailableDog) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d)));
    };
    const handleConfirm = () => {
        cancelSelectDogs();
        setIsDogBottomsheetOpen(false);
    };
    if (isDogsLoading) return <div>Loading...</div>;
    return (
        <>
            <Topbar>
                <Topbar.Front></Topbar.Front>
                <Topbar.Center></Topbar.Center>
                <Topbar.Back>
                    <img src={Notification} alt="Notification" />
                </Topbar.Back>
            </Topbar>
            <main className="flex flex-col px-5 bg-neutral-50 mb-[60px]">
                <WeatherInfo />
                <DogCardList dogs={dogs} />
                <Button
                    color={'primary'}
                    rounded={'medium'}
                    className={`w-[120px] h-12 fixed  text-white text-base font-bold leading-normal`}
                    style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                    disabled={dogs?.length === 0}
                    onClick={handleBottomSheet}
                >
                    산책하기
                </Button>
            </main>

            <BottomSheet isOpen={isDogBottomsheetOpen} onClose={handleBottomSheet}>
                <BottomSheet.Header> 강아지 선책</BottomSheet.Header>
                <BottomSheet.Body>
                    {availableDogs.map((dog) => (
                        <AvailableDogCheckList dog={dog} key={dog.id} onToggle={handleToggle} />
                    ))}
                </BottomSheet.Body>
                <BottomSheet.ConfirmButton
                    onConfirm={handleConfirm}
                    disabled={availableDogs.find((d) => d.isChecked) ? false : true}
                >
                    확인
                </BottomSheet.ConfirmButton>
            </BottomSheet>
        </>
    );
}

export default Home;
