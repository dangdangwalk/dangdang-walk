import OAuthButton from '@/components/OAuthButton';
import { OAUTH } from '@/constants/oauthList';
const Login = () => {
    return (
        <div>
            <p>로그인 페이지</p>
            <div className="flex gap-2">
                {OAUTH.map((oauth, index) => (
                    <OAuthButton key={index} provider={oauth.PROVIDER} name={oauth.NAME} />
                ))}
            </div>
        </div>
    );
};

export default Login;
