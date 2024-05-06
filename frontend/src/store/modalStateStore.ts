import { create } from 'zustand';

interface ModalState {
    isModalOpen: boolean;
    isJoinning: boolean;
    setModalState: (state: boolean) => void;
    setJoinningState: (state: boolean) => void;
}

export const useModalStateStore = create<ModalState>((set) => ({
    isModalOpen: false,
    isJoinning: false,
    setModalState: (state: boolean) => {
        set({ isModalOpen: state });
    },
    setJoinningState: (state: boolean) => {
        set({ isJoinning: state });
    },
}));
