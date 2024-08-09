import LoginAlertModal from '@/components/LoginAlertModal';
import OAuthButton from '@/components/OAuthButton';
import BottomSheet from '@/components/commons/BottomSheet';
import { OAUTH } from '@/constants';
import { useStore } from '@/store';
import React, { useState } from 'react';
interface Props {
    children: React.ReactNode;
}
export default function AuthLayout({ children }: Props) {
    const isSignIn = useStore((state) => state.isSignedIn);
    const [isLoginBottomSheetOpen, setLoginBottomSheetState] = useState(false);
    const handleClose = () => {
        setLoginBottomSheetState(false);
    };
    const handleToggle = (toggle: boolean) => {
        setLoginBottomSheetState(toggle);
    };
    return (
        <div className="flex max-w-screen-sm flex-col overflow-x-hidden">
            {children}
            {!isSignIn && !isLoginBottomSheetOpen && (
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
        </div>
    );
}
