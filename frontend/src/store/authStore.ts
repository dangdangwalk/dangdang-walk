import { storageKeys, tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { create } from 'zustand';
interface AuthState {
    isLoggedIn: boolean;
    storeLogin: (token: string | undefined) => void;
    storeLogout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: getStorage(storageKeys.IS_LOGGED_IN) ? true : false,
    storeLogin: (token: string | undefined) => {
        set({ isLoggedIn: true });
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
        setStorage(storageKeys.IS_LOGGED_IN, 'true');
    },
    storeLogout: () => {
        set({ isLoggedIn: false });
        removeStorage(storageKeys.IS_LOGGED_IN);
        removeHeader(tokenKeys.AUTHORIZATION);
    },
}));
