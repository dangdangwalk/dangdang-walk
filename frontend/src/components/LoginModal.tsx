import React from 'react';
import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import signupIn3secs from '@/assets/icons/ic-signup-asap.svg';
import cancel from '@/assets/icons/ic-top-cancel.svg';
import { Dispatch, SetStateAction } from 'react';
import { useModalStateStore } from '@/store/modalStateStore';

const LoginModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const prevURL = location.state.redirectURI;
    const prevURL = '/';
    const { setModalState } = useModalStateStore();
    return (
        <div className="flex flex-col h-dvh bg-slate-300 rounded-t-xl px-[1.875rem]">
            <div className="flex flex-col gap-2 justify-center mt-10">
                <div className="flex relative justify-center items-center mx-[4.375rem]">
                    <img className="" src={signupIn3secs} alt="빠른가입 안내" />
                    <p className="absolute text-center text-black font-semibold text-sm leading-[1.3rem]">
                        ⚡️3초만에 빠른 회원가입
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    {OAUTH.map((oauth, index) => (
                        <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} prevURL={prevURL} />
                    ))}
                </div>
                <button
                    className="ext-center font-['NanumGothic'] underline text-neutral-400 mt-4 py-[0.9375rem]"
                    onClick={() => setModalState(false)}
                >
                    비회원으로 둘러보기
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
