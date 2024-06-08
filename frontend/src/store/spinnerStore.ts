import { create } from 'zustand';

interface State {
    spinner: number;
    spinnerAdd: () => void;
    spinnerRemove: () => void;
}

export const useSpinnerStore = create<State>((set) => ({
    spinner: 0,

    spinnerAdd: () => {
        set((state) => {
            return {
                spinner: state.spinner + 1,
            };
        });
    },
    spinnerRemove: () => {
        set((state) => {
            return {
                spinner: state.spinner - 1,
            };
        });
    },
    spinnerClear: () => {
        set((state) => {
            return {
                spinner: 0,
            };
        });
    },
}));
