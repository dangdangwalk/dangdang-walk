import { StateCreator, create } from 'zustand';

export interface State {
    spinnerCount: number;
    spinnerAdd: () => void;
    spinnerRemove: () => void;
}

export const useSpinnerStore = create<State>((set) => ({
    spinnerCount: 0,

    spinnerAdd: () => {
        set((state) => {
            return {
                spinnerCount: state.spinnerCount + 1,
            };
        });
    },
    spinnerRemove: () => {
        set((state) => {
            return {
                spinnerCount: state.spinnerCount - 1,
            };
        });
    },
    spinnerClear: () => {
        set((state) => {
            return {
                spinnerCount: 0,
            };
        });
    },
}));

export const createSpinnerSlice: StateCreator<State> = (set) => ({
    spinnerCount: 0,

    spinnerAdd: () => {
        set((state) => {
            return {
                spinnerCount: state.spinnerCount + 1,
            };
        });
    },
    spinnerRemove: () => {
        set((state) => {
            return {
                spinnerCount: state.spinnerCount - 1,
            };
        });
    },
    spinnerClear: () => {
        set((state) => {
            return {
                spinnerCount: 0,
            };
        });
    },
});
