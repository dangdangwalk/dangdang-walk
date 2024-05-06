import { create } from 'zustand';

interface ModalState {
    isModalOpen: boolean;
    setModalState: (state: boolean) => void;
}

export const useModalStateStore = create<ModalState>((set) => ({
    isModalOpen: false,
    setModalState: (state: boolean) => {
        set({ isModalOpen: state });
    },
}));
