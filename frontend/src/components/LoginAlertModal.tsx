import React from 'react';
import LoginButton from '@/assets/icons/btn-login.svg';
import { useLoginModalStateStore } from '@/store/modalStateStore';

export default function LoginAlertModal() {
    const { isLoginModalOpen, setLoginModalState } = useLoginModalStateStore();
    return (
        <div className={`flex flex-col w-full h-dvh fixed ${isLoginModalOpen && 'bg-neutral-800/40'}`}>
            {!isLoginModalOpen && (
                <section
                    className={`top-0 left-0 w-full flex flex-col items-center justify-center h-full mb-[3.75rem]`}
                >
                    <h1 className="text-2xl font-bold font-['NanumGothic'] mb-1">산책기능</h1>
                    <p className="text-stone-500 font-['NanumGothic'] text-xs font-semibold mb-3">
                        댕댕워크 산책기능은 회원에게만 제공됩니다
                    </p>
                    <button onClick={() => setLoginModalState(true)}>
                        <img src={LoginButton} alt="Login" />
                    </button>
                </section>
            )}
        </div>
    );
}
