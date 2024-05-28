import LoginAlertModal from '@/components/LoginAlertModal';
import Navbar from '@/components/Navbar';
import OAuthButton from '@/components/OAuthButton';
import BottomSheet from '@/components/common/BottomSheet';
import { OAUTH, storageKeys } from '@/constants';
import { getStorage } from '@/utils/storage';
import React, { useState } from 'react';
interface Props {
    children: React.ReactNode;
}
export default function NavbarProvider({ children }: Props) {
    const [isLoginBottomSheetOpen, setLoginBottomSheetState] = useState(false);
    const handleClose = () => {
        setLoginBottomSheetState(false);
    };
    const handleToggle = (toggle: boolean) => {
        setLoginBottomSheetState(toggle);
    };
    const isLoggedIn = getStorage(storageKeys.IS_LOGGED_IN) ? true : false;
    return (
        <>
            {children}
            <Navbar />
            {!isLoggedIn && !isLoginBottomSheetOpen && (
                <LoginAlertModal isOpen={isLoginBottomSheetOpen} setToggle={handleToggle} />
            )}
            <BottomSheet isOpen={isLoginBottomSheetOpen} onClose={handleClose}>
                <BottomSheet.Body className="h-[230px]">
                    <div className="flex flex-col items-center gap-3 mx-2 mt-4 mb-5">
                        {OAUTH.map((oauth, index) => (
                            <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} />
                        ))}
                    </div>
                </BottomSheet.Body>
            </BottomSheet>
        </>
    );
}
