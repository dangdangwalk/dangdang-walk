import LoginAlertModal from '@/components/LoginAlertModal';
import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';

function Home() {
    const { isLoggedIn } = useAuth();
    return (
        <>
            <main className="flex flex-col px-5 bg-neutral-50">
                <div className={`${isLoggedIn ? '' : 'blur-sm'}`}>
                    <WeatherInfo />
                    <DogCardList />
                </div>

                <Button
                    color={'primary'}
                    rounded={'medium'}
                    className={`w-30 h-12 fixed  text-white text-base font-bold leading-normal`}
                    style={{ bottom: `calc(${NAV_HEIGHT} + 16px)`, left: '50%', translate: '-50%' }}
                >
                    산책하기
                </Button>
            </main>
            {!isLoggedIn && <LoginAlertModal />}
        </>
    );
}

export default Home;
