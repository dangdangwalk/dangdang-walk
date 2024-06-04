import LoginAlertModal from '@/components/LoginAlertModal';
import Navbar from '@/components/Navbar';
import OAuthButton from '@/components/OAuthButton';
import BottomSheet from '@/components/commons/BottomSheet';
import { OAUTH } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import React, { useState } from 'react';
interface Props {
    children: React.ReactNode;
}
export default function NavbarProvider({ children }: Props) {
    const { isLoggedIn } = useAuthStore();
    const [isLoginBottomSheetOpen, setLoginBottomSheetState] = useState(false);
    const handleClose = () => {
        setLoginBottomSheetState(false);
    };
    const handleToggle = (toggle: boolean) => {
        setLoginBottomSheetState(toggle);
    };
    return (
        <>
            {children}
            <Navbar />
            {!isLoggedIn && !isLoginBottomSheetOpen && (
                <LoginAlertModal isOpen={isLoginBottomSheetOpen} setToggle={handleToggle} />
            )}
            <BottomSheet isOpen={isLoginBottomSheetOpen} onClose={handleClose}>
                <BottomSheet.Body className="h-[230px]">
                    <div className="mx-2 mb-5 mt-4 flex flex-col items-center gap-3">
                        {OAUTH.map((oauth, index) => (
                            <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} />
                        ))}
                    </div>
                </BottomSheet.Body>
            </BottomSheet>
        </>
    );
}
