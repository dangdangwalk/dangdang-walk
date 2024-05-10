import { useEffect, useState } from 'react';

const useClock = () => {
    const [duration, setDuration] = useState<number>(0);
    const [isStart, setIsStart] = useState<boolean>(false);
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isStart) {
            intervalId = setInterval(() => {
                setDuration(duration + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isStart, duration]);

    return { isStart, setIsStart, duration };
};

export default useClock;
