import { AuthState, createAuthSlice } from '@/store/authStore';
import { CropState, createCropSlice } from '@/store/cropStore';
import { ModalState as LoginBottomSheetState, createLoginBottomSheetStateSlice } from '@/store/loginBottomSheetStore';
import { State as SpinnerState, createSpinnerSlice } from '@/store/spinnerStore';
import { StateAndActions as ToastState, createToastSlice } from '@/store/toastStore';
import { StateAndActions as WalkState, createWalkSlice } from '@/store/walkStore';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export const useStore = create<AuthState & CropState & LoginBottomSheetState & SpinnerState & ToastState & WalkState>()(
    devtools((...args) => ({
        ...createAuthSlice(...args),
        ...createCropSlice(...args),
        ...createLoginBottomSheetStateSlice(...args),
        ...createSpinnerSlice(...args),
        ...createToastSlice(...args),
        ...persist(createWalkSlice, {
            name: 'walk-storage', // Key for localStorage
            partialize: (state) => ({
                walkingDogs: state.walkingDogs,
                routes: state.routes,
                distance: state.distance,
                startedAt: state.startedAt,
                photoUrls: state.photoUrls,
            }),
            storage: createJSONStorage(() => localStorage),
        })(...args),
    }))
);
