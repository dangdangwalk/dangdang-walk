import { create } from 'zustand';

interface ModalState {
    isLoginModalOpen: boolean;
    isJoinning: boolean;
    setLoginModalState: (state: boolean) => void;
    setJoinningState: (state: boolean) => void;
}

export const useLoginModalStateStore = create<ModalState>((set) => ({
    isLoginModalOpen: false,
    isJoinning: false,
    setLoginModalState: (state: boolean) => {
        set({ isLoginModalOpen: state });
    },
    setJoinningState: (state: boolean) => {
        set({ isJoinning: state });
    },
}));
