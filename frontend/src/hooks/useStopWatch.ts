import { getElapsedTime } from '@/utils/time';
import { useEffect, useState } from 'react';

const useStopWatch = () => {
    const [startedAt, setStartedAt] = useState<string>('');
    const [duration, setDuration] = useState<number>(0);
    const [isStart, setIsStart] = useState<boolean>(false);

    const stopClock = () => {
        setIsStart(false);
        localStorage.removeItem('startedAt');
    };

    const startClock = (startTime: string | undefined) => {
        if (startTime) {
            const timeDiff = getElapsedTime(new Date(startTime), new Date());
            setStartedAt(startTime);
            setDuration(timeDiff);
        } else {
            setStartedAt(new Date().toString());
        }

        setIsStart(true);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isStart) {
            intervalId = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isStart, duration]);

    useEffect(() => {
        const startTime = localStorage.getItem('startedAt');
        if (!startTime) return;
    }, []);

    return { isStart, duration, stopClock, startClock, startedAt };
};

export default useStopWatch;
