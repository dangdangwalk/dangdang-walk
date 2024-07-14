import { StateCreator } from 'zustand';

export interface State {
    spinnerCount: number;
    spinnerAdd: () => void;
    spinnerRemove: () => void;
}

export const createSpinnerSlice: StateCreator<State, [['zustand/devtools', never]]> = (set) => ({
    spinnerCount: 0,

    spinnerAdd: () => {
        set(
            (state) => {
                return {
                    spinnerCount: state.spinnerCount + 1,
                };
            },
            false,
            'spinner/spinnerAdd'
        );
    },
    spinnerRemove: () => {
        set(
            (state) => {
                return {
                    spinnerCount: state.spinnerCount ? state.spinnerCount - 1 : 0,
                };
            },
            false,
            'spinner/spinnerRemove'
        );
    },
    spinnerClear: () => {
        set(
            (state) => {
                return {
                    spinnerCount: 0,
                };
            },
            false,
            'spinner/spinnerClear'
        );
    },
});
