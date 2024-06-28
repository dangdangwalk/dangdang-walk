import { useStore } from '@/store';
import { getElapsedTime } from '@/utils/time';
import { useEffect, useState } from 'react';

const useStopWatch = () => {
    const startedAt = useStore((state) => state.startedAt);
    const setStartedAt = useStore((state) => state.setStartedAt);

    const [duration, setDuration] = useState<number>(0);
    const [isStart, setIsStart] = useState<boolean>(false);

    const stopClock = () => {
        setIsStart(false);
    };

    const startClock = () => {
        if (startedAt === '') {
            setStartedAt(new Date().toString());
        } else {
            const timeDiff = getElapsedTime(new Date(startedAt), new Date());
            setDuration(timeDiff);
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

    return { isStart, duration, stopClock, startClock, startedAt };
};

export default useStopWatch;
