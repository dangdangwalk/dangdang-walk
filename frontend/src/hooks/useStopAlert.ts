import { useRef, useState } from 'react';

const useStopAlert = () => {
    const [isShowStopAlert, setIsShowStopAlert] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    const showStopAlert = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsShowStopAlert(true);
        timeoutRef.current = window.setTimeout(() => {
            setIsShowStopAlert(false);
        }, 1000);
    };

    return { isShowStopAlert, showStopAlert };
};

export default useStopAlert;
