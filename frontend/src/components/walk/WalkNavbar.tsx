import { useState, ChangeEvent } from 'react';
import Pause from '@/assets/icons/ic-pause.svg';
import Camera from '@/assets/icons/ic-camera.svg';
import Poop from '@/assets/icons/ic-poop.svg';

interface WalkNavbarProps {
    onOpen: () => void;
    onStop: (isStop: boolean) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
const LONG_CLICK_TIME = 1000;
//refactor onStop 네이밍 TODO
export default function WalkNavbar({ onOpen, onStop, onChange }: WalkNavbarProps) {
    const [isLongPress, setIsLongPress] = useState(false);
    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const handleLongPress = () => {
        setIsLongPress(true);
        onStop(true);
    };

    const startPressTimer = () => {
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
