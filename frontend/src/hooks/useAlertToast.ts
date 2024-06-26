import { useRef, useState } from 'react';

const useAlertToast = () => {
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    const showAlertToast = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsShowAlert(true);
        timeoutRef.current = window.setTimeout(() => {
            setIsShowAlert(false);
        }, 1000);
    };

    return { isShowAlert, showAlertToast };
};

export default useAlertToast;
