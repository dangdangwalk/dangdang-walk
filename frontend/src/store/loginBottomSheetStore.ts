import { StateCreator, create } from 'zustand';

export interface ModalState {
    isLoginBottomSheetOpen: boolean;
    setLoginBottomSheetState: (state: boolean) => void;
}

export const useLoginBottomSheetStateStore = create<ModalState>((set) => ({
    isLoginBottomSheetOpen: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state });
    },
}));

export const createLoginBottomSheetStateSlice: StateCreator<ModalState> = (set) => ({
    isLoginBottomSheetOpen: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state });
    },
});
