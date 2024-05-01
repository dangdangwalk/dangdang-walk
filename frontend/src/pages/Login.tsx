import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants/oauthList';
import { useLocation } from 'react-router-dom';
const Login = () => {
    const location = useLocation();
    const prevURL = location.state.currentURL;
    return (
        <div>
            <p>로그인 페이지</p>
            <div className="flex gap-2">
                {OAUTH.map((oauth, index) => (
                    <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} prevURL={prevURL} />
                ))}
            </div>
        </div>
    );
};

export default Login;
