import { tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { create } from 'zustand';
interface AuthState {
    isLoggedIn: boolean;
    storeLogin: (token: string) => void;
    storeLogout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: getStorage(tokenKeys.AUTHORIZATION) ? true : false,
    storeLogin: (token: string) => {
        set({ isLoggedIn: true });
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
        setStorage(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
    },
    storeLogout: () => {
        set({ isLoggedIn: false });
        removeHeader(tokenKeys.AUTHORIZATION);
        removeStorage(tokenKeys.AUTHORIZATION);
    },
}));
