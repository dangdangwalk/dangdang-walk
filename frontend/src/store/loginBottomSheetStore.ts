import { StateCreator } from 'zustand';

export interface ModalState {
    isLoginBottomSheetOpen: boolean;
    setLoginBottomSheetState: (state: boolean) => void;
}

export const createLoginBottomSheetStateSlice: StateCreator<ModalState, [['zustand/devtools', never]]> = (set) => ({
    isLoginBottomSheetOpen: false,
    setLoginBottomSheetState: (state: boolean) => {
        set({ isLoginBottomSheetOpen: state }, false, 'loginBottomSheetState/setLoginBottomSheetState');
    },
});
