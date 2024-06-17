import { AuthState, createAuthSlice } from '@/store/authStore';
import { CropState, createCropSlice } from '@/store/cropStore';
import { ModalState as LoginBottomSheetState, createLoginBottomSheetStateSlice } from '@/store/loginBottomSheetStore';
import { State as SpinnerState, createSpinnerSlice } from '@/store/spinnerStore';
import { StateAndActions as ToastState, createToastSlice } from '@/store/toastStore';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useStore = create<AuthState & CropState & LoginBottomSheetState & SpinnerState & ToastState>()(
    devtools((...args) => ({
        ...createAuthSlice(...args),
        ...createCropSlice(...args),
        ...createLoginBottomSheetStateSlice(...args),
        ...createSpinnerSlice(...args),
        ...createToastSlice(...args),
    }))
);
