import React, { useRef, useState } from 'react';
import Pause from '@/assets/icons/pause.svg';
import Camera from '@/assets/icons/camera.svg';
import Poop from '@/assets/icons/poop.svg';

interface WalkNavbarProps {
    onOpen: () => void;
    onStop: (isStop: boolean) => void;
}
const LONG_CLICK_TIME = 1000;
//refactor onStop 네이밍 TODO
export default function WalkNavbar({ onOpen, onStop }: WalkNavbarProps) {
    const [isLongPress, setIsLongPress] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseDown = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsLongPress(true);
        }, LONG_CLICK_TIME);
    };

    const handleMouseUp = () => {
        console.log(isLongPress);
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

    const handleTouchStart = () => {
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
        <nav className="absolute bottom-0 left-0 w-full flex px-[60px] py-3 justify-between bg-white items-center z-40">
            <button onClick={onOpen}>
                <img src={Poop} alt="배소변 버튼" />
            </button>
            <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <img src={Pause} alt="정지 버튼" />
            </button>
            <button>
                <img src={Camera} alt="카메라 버튼" />
            </button>
        </nav>
    );
}
