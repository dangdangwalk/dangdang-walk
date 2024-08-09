import { storageKeys } from '@/constants';
import { useSignIn } from '@/hooks/useAuth';
import { getStorage } from '@/utils/storage';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function OauthCallback() {
    const signIn = useSignIn();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const authorizeCode = params.get('code');
    const provider = getStorage(storageKeys.PROVIDER);

    useEffect(() => {
        if (authorizeCode && provider) {
            signIn.mutate({ authorizeCode, provider });
        }
    }, []);

    return <div></div>;
}
