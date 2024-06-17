import { StateCreator } from 'zustand';

const initialState: State = {
    isShowing: false,
    text: '',
    timeoutID: null,
};

const createToastSlice: StateCreator<StateAndActions, [['zustand/devtools', never]]> = (set) => ({
    ...initialState,

    show: (text, duration = 3000) => {
        set({ isShowing: true, text: text }, false, 'toast/show/start');

        const newTimeoutId = setTimeout(() => {
            set(initialState, false, 'toast/show/end');
        }, duration);

        set(
            (state) => {
                const oldTimeoutId = state.timeoutID;

                if (oldTimeoutId === null) {
                    return { timeoutID: newTimeoutId };
                }
                clearTimeout(oldTimeoutId);

                return { timeoutID: newTimeoutId };
            },
            false,
            'toast/show/setTimeoutID'
        );
    },
});

type Text = string;

interface State {
    isShowing: boolean;
    text: Text;
    timeoutID: NodeJS.Timeout | null;
}

interface Actions {
    show: (text: Text, duration?: number) => void;
}

export interface StateAndActions extends State, Actions {}

export { createToastSlice };
