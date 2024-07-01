import { tokenKeys } from '@/constants';
import { removeHeader, setHeader } from '@/utils/header';
import { StateCreator } from 'zustand';

export interface AuthState {
    isSignedIn: boolean;
    storeSignIn: (token: string | undefined) => void;
    storeSignOut: () => void;
}

export const createAuthSlice: StateCreator<AuthState, [['zustand/devtools', never]]> = (set) => ({
    isSignedIn: false,
    storeSignIn: (token: string | undefined) => {
        set({ isSignedIn: true }, false, 'auth/storeSignIn');
        setHeader(tokenKeys.AUTHORIZATION, `Bearer ${token}`);
    },
    storeSignOut: () => {
        set({ isSignedIn: false }, false, 'auth/storeSignOut');
        removeHeader(tokenKeys.AUTHORIZATION);
    },
});
