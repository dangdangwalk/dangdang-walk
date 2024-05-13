import { cookieKeys, storageKeys, tokenKeys } from '@/constants';
import { getCookie } from '@/utils/cookie';
import { removeHeader, setHeader } from '@/utils/header';
import { removeStorage } from '@/utils/storage';
import { create } from 'zustand';

interface StoreState {
    isStoreLogin: boolean;
    storeLogin: (token: string) => void;
    storeLogout: () => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    isStoreLogin: getCookie(cookieKeys.IS_LOGGED_IN),
    storeLogin: (token: string) => {
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
        set({ isStoreLogin: getCookie(cookieKeys.IS_LOGGED_IN) });
    },
    storeLogout: () => {
        removeHeader(tokenKeys.AUTHORIZATION);
        removeStorage(storageKeys.REDIRECT_URI);
        removeStorage(storageKeys.PROVIDER);
        window.location.reload();
    },
}));
