import React from 'react';
import LoginButton from '@/assets/icons/loginButton.svg';

export default function LoginAlertModal({ onClick }: { onClick: () => void }) {
    return (
        <section className="fixed top-0 left-0 bg-white/20 w-full flex flex-col items-center justify-center h-full ">
            <h1 className="text-3xl font-bold mb-1">산책기능</h1>
            <p className="text-slate-600 mb-3">댕댕워크 산책기능은 회원에게만 제공됩니다</p>
            <button onClick={onClick}>
                <img src={LoginButton} alt="Login" />
            </button>
        </section>
    );
}
