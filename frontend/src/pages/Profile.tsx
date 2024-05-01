import LoginAlertModal from '@/components/LoginAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const code = params.get('code');
    const { userLogin } = useAuth();
    console.log(code);
    const provider = localStorage.getItem('provider');
    if (code && provider) {
        console.log(code);
        console.log(provider);

        userLogin(code, provider);
        return <Navigate to="/profile" />;
    }
    const handleLogin = () => {
        const currentURL = window.location.pathname;
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
