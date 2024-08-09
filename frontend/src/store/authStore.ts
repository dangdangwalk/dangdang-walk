import { tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { StateCreator } from 'zustand';

//TODO: 로그인 로직 변경시 상태도 변경 필요
export interface AuthState {
    isSignedIn: boolean;
    isAuthLoading: boolean;
    storeSignIn: (token: string | undefined) => void;
    storeSignOut: () => void;
    setIsAuthLoading: (flag: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthState, [['zustand/devtools', never]]> = (set) => ({
    isSignedIn: false,
    isAuthLoading: true,

    storeSignIn: (token: string | undefined) => {
        set({ isSignedIn: true, isAuthLoading: false }, false, 'auth/storeSignIn');
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
    },
    storeSignOut: () => {
        set({ isSignedIn: false }, false, 'auth/storeSignOut');
        removeHeader(tokenKeys.AUTHORIZATION);
    },

    setIsAuthLoading: (flag: boolean) => {
        set({ isAuthLoading: flag }, false, 'auth/setIsAuthLoading');
    },
});
