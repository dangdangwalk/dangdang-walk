import { setStorage } from '@/utils/storage';
import React from 'react';
import icGoogle from '@/assets/icons/ic-google.svg';
import icKakao from '@/assets/icons/ic-kakao.svg';
import icNaver from '@/assets/icons/ic-naver.svg';
import { useLoginBottomSheetStateStore } from '@/store/loginBottomSheetStore';
import { getAuthorizeCodeCallbackUrl } from '@/utils/oauth';

type Props = {
    provider: string;
    name: string;
};
const OAuthButton = ({ provider, name }: Props) => {
    const { setLoginBottomSheetState } = useLoginBottomSheetStateStore();
    const btnLogin = (provider: string) => {
        switch (provider) {
            case 'google':
                return icGoogle;
            case 'kakao':
                return icKakao;
            case 'naver':
                return icNaver;
            default:
                return;
        }
    };
    const bgColor = (provider: string) => {
        switch (provider) {
            case 'google':
                return 'bg-google';
            case 'kakao':
                return 'bg-kakao';
            case 'naver':
                return 'bg-naver';
            default:
                return;
        }
    };
    const handleCallOAuth = (provider: string) => {
        setStorage('provider', provider);
        setStorage('redirectURI', window.location.pathname);
        let url = getAuthorizeCodeCallbackUrl(provider);
        window.location.href = url;
    };
    return (
        <button
            className={`rounded-lg flex justify-center items-center relative w-full h-[3.25rem] ${bgColor(
                provider
            )} ${provider === 'google' && 'border border-neutral-200 '}`}
            onClick={() => {
                setLoginBottomSheetState(false);
                setTimeout(() => {
                    handleCallOAuth(provider);
                }, 100);
            }}
        >
            <img className="absolute left-0 ml-5" src={btnLogin(provider)} alt={`${provider}`} />
            <div
                className={`my-auto text-center text-base font-bold font-roboto leading-normal  ${
                    provider === 'kakao' && 'text-opacity-85'
                } ${provider === 'naver' ? 'text-white' : 'text-black'}`}
            >
                {name}로 시작하기
            </div>
        </button>
    );
};

export default OAuthButton;
