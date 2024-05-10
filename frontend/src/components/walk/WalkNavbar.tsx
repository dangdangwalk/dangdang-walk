import React from 'react';
import Pause from '@/assets/icons/pause.svg';
import Camera from '@/assets/icons/camera.svg';
import Poop from '@/assets/icons/poop.svg';

interface WalkNavbarProps {
    onOpen: () => void;
    onStop: () => void;
}

export default function WalkNavbar({ onOpen, onStop }: WalkNavbarProps) {
    return (
        <nav className="fixed bottom-0 left-0 w-full flex px-[60px] py-3 justify-between bg-white items-center z-30">
            <div onClick={onOpen}>
                <img src={Poop} alt="배소변 버튼" />
            </div>
            <div onClick={onStop}>
                <img src={Pause} alt="정지 버튼" />
            </div>
            <div>
                <img src={Camera} alt="카메라 버튼" />
            </div>
        </nav>
    );
}
