import React from 'react';

type Props = {
    provider: string;
    name: string;
    prevURL: string;
};
const OAuthButton = ({ provider, name, prevURL }: Props) => {
    const handleCallOAuth = (provider: string) => {
        console.log(provider);
        localStorage.setItem('provider', provider);
        let url = '';
        switch (provider) {
            case 'google':
                url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
                break;
            case 'kakao':
                url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}&scope=account_email,profile_nickname,profile_image`;
                break;
            case 'naver':
                url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${prevURL}&state=naverLoginState`;
                break;

            default:
                break;
        }
        window.location.href = url;
    };
    return (
        <button className="bg-yellow-200" onClick={() => handleCallOAuth(provider)}>
            {name} 로그인하기
        </button>
    );
};

export default OAuthButton;
