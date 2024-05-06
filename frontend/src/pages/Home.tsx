import DogCardList from '@/components/home/DogCardList';
import WeatherInfo from '@/components/home/WeatherInfo';
import React from 'react';

function Home() {
    return (
        <main className=" px-5 bg-neutral-50">
            <WeatherInfo />
            <DogCardList />
        </main>
    );
}

export default Home;
