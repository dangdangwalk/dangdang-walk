import { Dog } from '@/models/dog.model';
import React from 'react';

interface DogStatistic extends Dog {
    recommendedDailyWalkAmount: number;
    dailyWalkAmount: number;
    weeklyWalks: number[];
}

interface DogCardProps {
    dog: DogStatistic;
}

export default function DogCard({ dog }: DogCardProps) {
    return <div>DogCard</div>;
}
