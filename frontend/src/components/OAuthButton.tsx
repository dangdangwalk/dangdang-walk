import { setStorage } from '@/utils/storage';
import React from 'react';
import btnGoogle from '@/assets/icons/btn-login-google.svg';
import btnKakao from '@/assets/icons/btn-login-kakao.svg';
import btnNaver from '@/assets/icons/btn-login-naver.svg';

type Props = {
    provider: string;
    name: string;
    prevURL: string;
};
const OAuthButton = ({ provider, name, prevURL }: Props) => {
    const btnLogin = (provider: string) => {
        switch (provider) {
            case 'google':
                return btnGoogle;
            case 'kakao':
                return btnKakao;
            case 'naver':
                return btnNaver;
            default:
                return;
        }
    };
    const handleCallOAuth = (provider: string) => {
        setStorage('provider', provider);
        let url = '';
        switch (provider) {
            case 'google':
                url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email&prompt=select_account`;
                break;
            case 'kakao':
                url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}`;
                break;
            case 'naver':
                url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}&state=naverLoginState`;
                break;
        }
        window.location.href = url;
    };
    return (
        <button onClick={() => handleCallOAuth(provider)}>
            <img src={btnLogin(provider)} alt={`${provider}`} />
        </button>
    );
};

export default OAuthButton;
