import LoginAlertModal from '@/components/LoginAlertModal';
import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

function Home() {
    const { isLoggedIn } = useAuth();
    return (
        <main className="flex flex-col px-5 bg-neutral-50">
            <div className={`${isLoggedIn ? '' : 'blur-sm'}`}>
                <WeatherInfo />
                <DogCardList />
            </div>
            {!isLoggedIn && <LoginAlertModal />}
        </main>
    );
}

export default Home;
