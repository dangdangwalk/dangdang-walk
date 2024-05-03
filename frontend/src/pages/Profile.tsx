import LoginAlertModal from '@/components/LoginAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { getStorage } from '@/utils/storage';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const redirectURI = window.location.pathname;
    const provider = getStorage('provider');
    const { isLoggedIn } = useAuthStore();
    const { userLogin, useLogout } = useAuth();

    if (authorizeCode && provider && !isLoggedIn) {
        userLogin({ authorizeCode, provider, redirectURI });
    }
    const handleLogin = () => {
        navigate('/login', { state: { redirectURI } });
    };

    return (
        <div>
            <button onClick={useLogout}>로그아웃</button>
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
