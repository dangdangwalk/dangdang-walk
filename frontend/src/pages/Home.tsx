import LoginAlertModal from '@/components/LoginAlertModal';
import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { NAV_HEIGHT, TOP_BAR_HEIGHT } from '@/constants/style';
import { DogStatistic } from '@/components/home/DogCard';
import Notification from '@/assets/icons/notification.svg';
import Topbar from '@/components/common/Topbar';
import { useLocation } from 'react-router-dom';
import { getStorage } from '@/utils/storage';

const dogs: DogStatistic[] = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        recommendedDailyWalkAmount: 3600, //하루 권장 산책량,
        dailyWalkAmount: 3600, //하루 산책량
        weeklyWalks: [0, 1, 2, 0, 0, 0, 1], // 한 주간 산책 체크
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        recommendedDailyWalkAmount: 12600, //하루 권장 산책량,
        dailyWalkAmount: 3600, //하루 산책량
        weeklyWalks: [0, 1, 0, 1, 1, 0, 1], // 한 주간 산책 체크
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        recommendedDailyWalkAmount: 12600, //하루 권장 산책량,
        dailyWalkAmount: 0, //하루 산책량
        weeklyWalks: [0, 1, 0, 1, 1, 0, 1], // 한 주간 산책 체크
    },
];

function Home() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const provider = getStorage('provider');
    const redirectURI = window.location.pathname;
    const { isLoggedIn, loginMutation } = useAuth();
    useEffect(() => {
        if (authorizeCode && provider && !isLoggedIn) {
            loginMutation.mutate({ authorizeCode, provider, redirectURI });
        }
    }, []);
    return (
        <>
            <Topbar>
                <Topbar.Front></Topbar.Front>
                <Topbar.Center></Topbar.Center>
                <Topbar.Back>
                    <img src={Notification} alt="Notification" />
                </Topbar.Back>
            </Topbar>
            <main className="flex flex-col px-5 bg-neutral-50">
                <WeatherInfo />
                <DogCardList dogs={dogs} />
                <Button
                    color={'primary'}
                    rounded={'medium'}
                    className={`w-[120px] h-12 fixed  text-white text-base font-bold leading-normal`}
                    style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                    disabled={dogs.length === 0}
                >
                    산책하기
                </Button>
            </main>
            {!isLoggedIn && (
                <div
                    className="absolute left-0 w-screen h-screen z-1 backdrop-blur-sm"
                    style={{ top: TOP_BAR_HEIGHT }}
                ></div>
            )}
            {!isLoggedIn && <LoginAlertModal />}

            {/* 
            <DogBottomSheet
                isOpen={!isWalk}
                onClose={() => {}}
                disabled={availableDog.find((d) => d.isChecked) ? false : true}
            >
                {availableDog.length > 1 && (
                    <>
                        <Divider className="h-0 border border-neutral-200" />
                        <li className="flex py-2 justify-between items-center">
                            <Avatar url={AllDogs} name={'다함께'} />
                            <DogCheckBox id={-1} isChecked={false} onChange={handleDogSelect} />
                        </li>
                    </>
                )}
                {availableDog.map((dog) => (
                    <>
                        <Divider key={`${dog.id}-divider`} className="h-0 border border-neutral-200" />
                        <li className="flex py-2 justify-between items-center" key={dog.id}>
                            <Avatar url={dog.photoUrl} name={dog.name} />
                            <DogCheckBox id={dog.id} isChecked={dog.isChecked} onChange={handleDogSelect} />
                        </li>
                    </>
                ))}
            </DogBottomSheet> */}
        </>
    );
}

export default Home;
