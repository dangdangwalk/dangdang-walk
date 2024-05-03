import { tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { create } from 'zustand';

interface StoreState {
    isLoggedIn: boolean;
    storeLogin: (token: string) => void;
    storeLogout: () => void;
}

export const useAuthStore = create<StoreState>((set) => ({
    isLoggedIn: getStorage(tokenKeys.ACCESS_TOKEN) ? true : false,
    storeLogin: (token: string) => {
        set({ isLoggedIn: true });
        setHeader(tokenKeys.AUTHORIZATION, token);
        setStorage(tokenKeys.AUTHORIZATION, token);
        removeStorage('provider');
    },
    storeLogout: () => {
        set({ isLoggedIn: false });
        removeStorage(tokenKeys.ACCESS_TOKEN);
        removeHeader(tokenKeys.AUTHORIZATION);
    },
}));
