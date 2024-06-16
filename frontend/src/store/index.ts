import { AuthState, createAuthSlice } from '@/store/authStore';
import { CropState, createCropSlice } from '@/store/cropStore';
import { ModalState as LoginBottomSheetState, createLoginBottomSheetStateSlice } from '@/store/loginBottomSheetStore';
import { State as SpinnerState, createSpinnerSlice } from '@/store/spinnerStore';
import { StateAndActions as ToastState, createToastSlice } from '@/store/toastStore';
import { create } from 'zustand';

export const useStore = create<AuthState & CropState & LoginBottomSheetState & SpinnerState & ToastState>()(
    (...args) => ({
        ...createAuthSlice(...args),
        ...createCropSlice(...args),
        ...createLoginBottomSheetStateSlice(...args),
        ...createSpinnerSlice(...args),
        ...createToastSlice(...args),
    })
);
