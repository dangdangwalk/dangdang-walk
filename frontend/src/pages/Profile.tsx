import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const handleLogin = () => {
        const currentURL = window.location.pathname;
        navigate('/login', { state: { currentURL } });
    };

    return (
        <div>
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}

export default Profile;
