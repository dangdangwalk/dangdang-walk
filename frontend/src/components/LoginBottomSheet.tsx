import React from 'react';
import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants';
import { useLoginBottomSheetStateStore } from '@/store/loginBottomSheetStore';

const LoginBottomSheet = () => {
    const { setLoginBottomSheetState } = useLoginBottomSheetStateStore();
    return (
        <div className="flex flex-col h-dvh bg-white rounded-t-xl px-[1.875rem]">
            <div className="flex flex-col gap-2 justify-center mt-10">
                <div className="flex flex-col items-center gap-3">
                    {OAUTH.map((oauth, index) => (
                        <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} />
                    ))}
                </div>
                <button
                    className="ext-center font-['NanumGothic'] underline text-neutral-400 mt-4 py-[0.9375rem]"
                    onClick={() => setLoginBottomSheetState(false)}
                >
                    비회원으로 둘러보기
                </button>
            </div>
        </div>
    );
};

export default LoginBottomSheet;
