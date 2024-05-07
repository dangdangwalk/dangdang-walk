import React from 'react';
import LoginAlertModal from '@/components/LoginAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { getStorage, removeStorage } from '@/utils/storage';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Profile() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const provider = getStorage('provider');
    const isJoinning = getStorage('isJoinning');
    const redirectURI = window.location.pathname;
    const { loginMutation, isLoggedIn, logoutMutation } = useAuth();

    useEffect(() => {
        // if (authorizeCode && provider && !isLoggedIn && isJoinning) {
        //     removeStorage('isJoinning');
        //     return;
        // }
        if (authorizeCode && provider && !isLoggedIn) {
            loginMutation.mutate({ authorizeCode, provider, redirectURI });
        }
    }, []);
    return (
        <div className="flex flex-col w-full items-center h-full">
            <div className={`w-full h-full ${isLoggedIn ? '' : 'blur-sm'}`}>
                <button onClick={() => logoutMutation.mutate(null)}>로그아웃</button>
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
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
                <div>fdsfdsfdsafdsafdhskafhkdshflds</div>
            </div>
            {!isLoggedIn && <LoginAlertModal />}
        </div>
    );
}

export default Profile;
