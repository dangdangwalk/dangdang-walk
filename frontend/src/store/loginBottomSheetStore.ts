import { create } from 'zustand';

interface ModalState {
    isLoginBottomSheetOpen: boolean;
    setLoginBottomSheetState: (state: boolean) => void;
}

export const useLoginBottomSheetStateStore = create<ModalState>((set) => ({
    isLoginBottomSheetOpen: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state });
    },
}));
