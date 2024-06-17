import { useState, ChangeEvent, useEffect } from 'react';
import Pause from '@/assets/icons/ic-pause.svg';
import Camera from '@/assets/icons/ic-camera.svg';
import Poop from '@/assets/icons/ic-poop.svg';

interface WalkNavbarProps {
    onOpen: () => void;
    onStop: (isStop: boolean) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
const LONG_CLICK_TIME = 1000;
const LEFT_CLICK = 0;

export default function WalkNavbar({ onOpen, onStop, onChange }: WalkNavbarProps) {
    const [isLongPress, setIsLongPress] = useState(false);
    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
            setIsMobile(true);
        }
    }, []);

    const handleLongPress = () => {
        setIsLongPress(true);
        onStop(true);
    };

    const startPressTimer = (event: React.MouseEvent | React.TouchEvent) => {
        if ('button' in event && event.button !== LEFT_CLICK) {
            return;
        }

        setIsPressed(true);
        if (!isMobile) {
            setPressTimer(setTimeout(handleLongPress, LONG_CLICK_TIME));
        }
    };

    const cancelPressTimer = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
        setIsLongPress(false);
    };
    const handleSingleClick = () => {
        if (!isLongPress) {
            onStop(false);
        }
        setIsPressed(false);
        setIsLongPress(false);
    };
    const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isMobile) {
            handleLongPress();
        } else {
            event.preventDefault();
        }
    };

    return (
        <nav className="absolute bottom-0 left-0 z-40 flex w-full items-center justify-between bg-white px-[60px] py-3">
            <button onClick={onOpen}>
                <img src={Poop} alt="배소변 버튼" />
            </button>
            <button
                onMouseDown={startPressTimer}
                onMouseUp={cancelPressTimer}
                onMouseLeave={cancelPressTimer}
                onTouchStart={startPressTimer}
                onTouchEnd={cancelPressTimer}
                onTouchCancel={cancelPressTimer}
                onClick={handleSingleClick}
                onContextMenu={handleContextMenu}
                className={`transition-transform duration-1000 ease-out ${isPressed ? 'scale-125' : 'scale-100'}`}
            >
                <img src={Pause} alt="정지 버튼" />
            </button>
            <button>
                <input
                    className="hidden"
                    type="file"
                    id="camera"
                    name="camera"
                    capture="environment"
                    accept="image/*"
                    onChange={onChange}
                />
                <label htmlFor="camera">
                    <img src={Camera} alt="카메라 버튼" />
                </label>
            </button>
        </nav>
    );
}
