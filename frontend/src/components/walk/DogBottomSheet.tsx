import { Button } from '@/components/common/Button';
import { NAV_HEIGHT } from '@/constants/style';
import React, { useState } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    disabled: boolean;
    children?: React.ReactNode;
}

export default function DogBottomSheet({ isOpen, onClose, children, disabled }: BottomSheetProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(isOpen);

    const handleClose = () => {
        setIsSheetOpen(false);
        onClose();
    };
    return (
        <div className={`fixed inset-0 overflow-hidden z-50 ${isSheetOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0  bg-neutral-800 opacity-40" onClick={handleClose}></div>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-6 transform transition-transform ease-in-out duration-1000">
                <div className="text-center text-black text-base font-semibold leading-normal mb-4">강아지 선택</div>
                <ul className="flex flex-col px-5 overflow-y-scroll h-[180px]">{children}</ul>
                <Button
                    className="absolue bottom-0 w-full"
                    style={{ height: NAV_HEIGHT }}
                    rounded={'none'}
                    disabled={disabled}
                >
                    산책하기
                </Button>
            </div>
        </div>
    );
}
