import { useEffect, useState } from 'react';
const WALK_MET = 3;
const WEIGHT = 70;
const useClock = () => {
    const [duration, setDuration] = useState<number>(0);
    const [isStart, setIsStart] = useState<boolean>(false);
    const [calories, setCalories] = useState<number>(0);
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isStart) {
            intervalId = setInterval(() => {
                setDuration(duration + 1);
                setCalories(Math.round((WALK_MET * WEIGHT * (duration + 1)) / 3600));
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isStart, duration]);

    return { isStart, setIsStart, duration, calories };
};

export default useClock;
