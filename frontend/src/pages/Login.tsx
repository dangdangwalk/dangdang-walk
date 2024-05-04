import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants';
import { useLocation } from 'react-router-dom';
import signupIn3secs from '@/assets/icons/ic-signup-asap.svg';
const Login = () => {
    const location = useLocation();
    const prevURL = location.state.redirectURI;
    return (
        <div className="flex flex-col">
            <div>로고나 간단한 앱 소개 영역</div>

            <div className="flex flex-col gap-2 justify-center">
                <div className="flex relative justify-center items-center bg-red-400">
                    <img className="bg-slate-200" src={signupIn3secs} alt="빠른가입 안내" />
                    <p className="absolute flex items-center mb-2">⚡️3초만에 빠른 회원가입</p>
                </div>
                <div className="flex flex-col">
                    {OAUTH.map((oauth, index) => (
                        <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} prevURL={prevURL} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
