import { StateCreator } from 'zustand';

export interface ModalState {
    isLoginBottomSheetOpen: boolean;
    setLoginBottomSheetState: (state: boolean) => void;
}

export const createLoginBottomSheetStateSlice: StateCreator<ModalState> = (set) => ({
    isLoginBottomSheetOpen: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state });
    },
});
