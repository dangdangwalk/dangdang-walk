import { useState, ChangeEvent } from 'react';
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

    const handleLongPress = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
        setIsLongPress(true);
        onStop(true);
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    };

    const startPressTimer = (event: React.MouseEvent | React.TouchEvent) => {
        if ('button' in event && event.button !== LEFT_CLICK) {
            return;
        }

        setIsPressed(true);
        setPressTimer(setTimeout(handleLongPress, LONG_CLICK_TIME));
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

    return (
        <nav className="absolute z-40 flex w-full items-center justify-between bg-white px-[60px] py-3 sm:w-[640px]">
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
                className={`transition-transform duration-1000 ease-out ${isPressed ? 'scale-125' : 'scale-100'}`}
            >
                <PauseIcon />
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
const PauseIcon = () => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="btn / walk / pause" clipPath="url(#clip0_2_2975)">
            <rect width="56" height="56" fill="white" />
            <circle id="Ellipse 113" cx="28" cy="28" r="28" fill="#FF9900" />
            <rect id="Rectangle 14807" x="18" y="18" width="20" height="20" rx="2" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_2_2975">
                <rect width="56" height="56" fill="white" />
            </clipPath>
        </defs>
    </svg>
);
