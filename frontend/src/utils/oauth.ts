import { getStorage, setStorage } from '@/utils/storage';

const getAuthorizeCodeCallbackUrl = (provider: string) => {
    let url = '';
    const currentUrl = getStorage('redirectURI');
    switch (provider) {
        case 'google':
            url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email`;
            break;
        case 'kakao':
            url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}`;
            break;
        case 'naver':
            url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}${currentUrl}&state=naverLoginState`;
            break;
    }
    return url;
};

export { getAuthorizeCodeCallbackUrl };
