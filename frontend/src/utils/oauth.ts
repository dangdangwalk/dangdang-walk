const getAuthorizeCodeCallbackUrl = (provider: string) => {
    const {
        REACT_APP_BASE_URL: BASE_URL = '',
        REACT_APP_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID = '',
        REACT_APP_KAKAO_CLIENT_ID: KAKAO_CLIENT_ID = '',
        REACT_APP_NAVER_CLIENT_ID: NAVER_CLIENT_ID = '',
    } = window._ENV ?? process.env;

    let url = '';
    switch (provider) {
        case 'google':
            url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${BASE_URL}/callback&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&prompt=select_account`;
            break;
        case 'kakao':
            url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${BASE_URL}/callback&prompt=select_account`;
            break;
        case 'naver':
            url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${BASE_URL}/callback&state=naverLoginState&auth_type=reauthenticate`;
            break;
    }
    return url;
};

export { getAuthorizeCodeCallbackUrl };
