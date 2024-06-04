import { useRef, useState, MouseEvent, TouchEvent, ChangeEvent } from 'react';
import Pause from '@/assets/icons/pause.svg';
import Camera from '@/assets/icons/camera.svg';
import Poop from '@/assets/icons/poop.svg';

interface WalkNavbarProps {
    onOpen: () => void;
    onStop: (isStop: boolean) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
const LONG_CLICK_TIME = 1000;
//refactor onStop 네이밍 TODO
export default function WalkNavbar({ onOpen, onStop, onChange }: WalkNavbarProps) {
    const [isLongPress, setIsLongPress] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        timeoutRef.current = window.setTimeout(() => {
            setIsLongPress(true);
        }, LONG_CLICK_TIME);
    };

    const handleMouseUp = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            if (isLongPress) {
                onStop(true);
            } else {
                onStop(false);
            }
        }
        timeoutRef.current = null;
        setIsLongPress(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
        timeoutRef.current = window.setTimeout(() => {
            setIsLongPress(true);
        }, LONG_CLICK_TIME);
    };

    const handleTouchEnd = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            if (isLongPress) {
                onStop(true);
            } else {
                onStop(false);
            }
        }
        timeoutRef.current = null;
        setIsLongPress(false);
    };

    return (
        <nav className="absolute bottom-0 left-0 z-40 flex w-full items-center justify-between bg-white px-[60px] py-3">
            <button onClick={onOpen}>
                <img src={Poop} alt="배소변 버튼" />
            </button>
            <button
                onMouseDown={(e) => {
                    handleMouseDown(e);
                }}
                onMouseUp={handleMouseUp}
                onTouchStart={(e) => {
                    handleTouchStart(e);
                }}
                onTouchEnd={handleTouchEnd}
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
