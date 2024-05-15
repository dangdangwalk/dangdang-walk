import { storageKeys, tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { removeStorage } from '@/utils/storage';
import { create } from 'zustand';

interface StoreState {
    isStoreLogin: boolean;
    expiresIn: number;
    storeLogin: (token: string, isLoggedIn: boolean, expiresIn: number) => void;
    storeLogout: () => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    isStoreLogin: false,
    expiresIn: 0,
    storeLogin: (token: string, isLoggedIn: boolean, expiresIn: number) => {
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
        set({ isStoreLogin: isLoggedIn });
        set({ expiresIn });
    },
    storeLogout: () => {
        removeHeader(tokenKeys.AUTHORIZATION);
        removeStorage(storageKeys.REDIRECT_URI);
        removeStorage(storageKeys.PROVIDER);
        set({ isStoreLogin: false });
        window.location.reload();
    },
}));
