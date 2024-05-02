import LoginAlertModal from '@/components/LoginAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const { userLogin } = useAuth();
    const currentURL = window.location.pathname;
    const provider = localStorage.getItem('provider');
    if (authorizeCode && provider) {
        console.log(authorizeCode);
        console.log(provider);

        userLogin(authorizeCode, provider, currentURL);
        return <Navigate to="/profile" />;
    }
    const handleLogin = () => {
        navigate('/login', { state: { currentURL } });
    };

    const cookie = false;

    return (
        <div>
            <div className={` ${cookie ? '' : 'blur-sm'}`}>
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
            {!cookie && <LoginAlertModal onClick={handleLogin} />}
        </div>
    );
}

export default Profile;
