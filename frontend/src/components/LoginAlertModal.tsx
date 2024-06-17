import React from 'react';
import LoginButton from '@/assets/buttons/btn-login.svg';

interface Props {
    isOpen: boolean;
    setToggle: (toggle: boolean) => void;
}
export default function LoginAlertModal({ isOpen, setToggle }: Props) {
    return (
        <div className="fixed top-0 z-10 h-dvh w-full max-w-screen-sm backdrop-blur-sm">
            <div className={`absolute z-10 flex size-full flex-col`}>
                {!isOpen && (
                    <section className={`mb-[3.75rem] flex size-full flex-col items-center justify-center`}>
                        <h1 className="mb-1 text-2xl font-bold">산책기능</h1>
                        <p className="mb-3 text-xs font-semibold text-stone-500">
                            댕댕워크 산책기능은 회원에게만 제공됩니다
                        </p>
                        <button onClick={() => setToggle(true)}>
                            <img src={LoginButton} alt="Login" />
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
}
