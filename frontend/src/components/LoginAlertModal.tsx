import React from 'react';
import LoginButton from '@/assets/icons/btn-login.svg';

interface Props {
    isOpen: boolean;
    setToggle: (toggle: boolean) => void;
}
export default function LoginAlertModal({ isOpen, setToggle }: Props) {
    return (
        <div className="fixed w-full h-dvh top-0 right-0 z-10 backdrop-blur-sm">
            <div className={`flex flex-col w-full h-full absolute z-10 `}>
                {!isOpen && (
                    <section className={`w-full flex flex-col items-center justify-center h-full mb-[3.75rem] `}>
                        <h1 className="text-2xl font-bold mb-1">산책기능</h1>
                        <p className="text-stone-500 text-xs font-semibold mb-3">
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
