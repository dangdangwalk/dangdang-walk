import LoginAlertModal from '@/components/LoginAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { getStorage, setStorage } from '@/utils/storage';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const provider = getStorage('provider');
    const redirectURI = window.location.pathname;
    const { loginMutation, isLoggedIn, logoutMutation } = useAuth();

    useEffect(() => {
        if (authorizeCode && provider && !isLoggedIn) {
            setStorage('redirect', redirectURI);
            loginMutation.mutate({ authorizeCode, provider, redirectURI });
        }
    }, []);

    const handleLogin = () => {
        navigate('/login', { state: { redirectURI } });
    };

    return (
        <div>
            <button onClick={() => logoutMutation.mutate(null)}>로그아웃</button>
            <div className={` ${isLoggedIn ? '' : 'blur-sm'}`}>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
            </div>
            {!isLoggedIn && <LoginAlertModal onClick={handleLogin} />}
        </div>
    );
}

export default Profile;
