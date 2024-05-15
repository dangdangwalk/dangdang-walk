import { storageKeys, tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { removeStorage } from '@/utils/storage';
import { create } from 'zustand';

interface StoreState {
    expiresIn: number;
    storeLogin: (token: string) => void;
    storeLogout: () => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    expiresIn: 1000 * 60 * 60,
    storeLogin: (token: string) => {
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
    },
    storeLogout: () => {
        removeHeader(tokenKeys.AUTHORIZATION);
        removeStorage(storageKeys.REDIRECT_URI);
        removeStorage(storageKeys.PROVIDER);
    },
}));
