import { create } from 'zustand';

interface ModalState {
    isLoginBottomSheetOpen: boolean;
    isJoinning: boolean;
    setLoginBottomSheetState: (state: boolean) => void;
    setJoinningState: (state: boolean) => void;
}

export const useLoginBottomSheetStateStore = create<ModalState>((set) => ({
    isLoginBottomSheetOpen: false,
    isJoinning: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state });
    },
    setJoinningState: (state: boolean) => {
        set({ isJoinning: state });
    },
}));
