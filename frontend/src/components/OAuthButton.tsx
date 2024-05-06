import { setStorage } from '@/utils/storage';
import React from 'react';
import icGoogle from '@/assets/icons/ic-google.svg';
import icKakao from '@/assets/icons/ic-kakao.svg';
import icNaver from '@/assets/icons/ic-naver.svg';
import { useNavigate } from 'react-router-dom';
import { useLoginBottomSheetStateStore } from '@/store/loginBottomSheetStore';

type Props = {
    provider: string;
    name: string;
};
const OAuthButton = ({ provider, name }: Props) => {
    const { setLoginBottomSheetState } = useLoginBottomSheetStateStore();
    const currentUrl = window.location.pathname;
    const navigate = useNavigate();
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
        let url = '';
        switch (provider) {
            case 'google':
                url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email&prompt=select_account`;
                break;
            case 'kakao':
                url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}`;
                break;
            case 'naver':
                url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}&state=naverLoginState`;
                break;
        }
        //1. oauthUrl set
        //2. currentUrl set
        //3. 동의 페이지로 이동
        navigate('/join', { state: { oauthUrl: url } });
    };
    return (
        <button
            className={`rounded-lg flex justify-center items-center relative w-full h-[3.25rem] ${bgColor(provider)} ${provider === 'google' && 'border border-neutral-200 '}`}
            onClick={() => {
                handleCallOAuth(provider);
                setLoginBottomSheetState(false);
            }}
        >
            <img className="absolute left-0 ml-5" src={btnLogin(provider)} alt={`${provider}`} />
            <div
                className={`my-auto text-center text-base font-bold font-roboto leading-normal  ${provider === 'kakao' && 'text-opacity-85'} ${provider === 'naver' ? 'text-white' : 'text-black'}`}
            >
                {name}로 시작하기
            </div>
        </button>
    );
};

export default OAuthButton;
