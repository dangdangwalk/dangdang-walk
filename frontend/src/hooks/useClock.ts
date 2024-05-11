import { getElapsedTime } from '@/utils/date';
import { useEffect, useState } from 'react';

const useClock = () => {
    const [startedAt, setStartedAt] = useState<string>('');
    const [duration, setDuration] = useState<number>(0);
    const [isStart, setIsStart] = useState<boolean>(false);

    const setStartTime = (date: Date) => {
        const startTime = localStorage.getItem('startedAt');
        if (startTime) return;
        localStorage.setItem('startedAt', date.toISOString());
        setStartedAt(date.toISOString());
    };

    const stopClock = () => {
        setIsStart(false);
        localStorage.removeItem('startedAt');
    };

    const startClock = (date: Date) => {
        setStartTime(date);
        setIsStart(true);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isStart) {
            intervalId = setInterval(() => {
                setDuration(duration + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isStart, duration]);

    useEffect(() => {
        const startTime = localStorage.getItem('startedAt');
        if (!startTime) return;

        const timeDiff = getElapsedTime(new Date(startTime), new Date());
        setStartedAt(startTime);
        setDuration(timeDiff);
    }, []);

    return { isStart, duration, stopClock, startClock, startedAt };
};

export default useClock;
