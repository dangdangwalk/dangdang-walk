import { create } from 'zustand';

const initialState: State = {
    isShowing: false,
    text: '',
    timeoutID: null,
};

const useToastStore = create<StateAndActions>()((set) => ({
    ...initialState,

    show: (text, duration = 3000) => {
        set({ isShowing: true, text: text });

        const newTimeoutId = setTimeout(() => {
            set(initialState);
        }, duration);

        set((state) => {
            const oldTimeoutId = state.timeoutID;

            if (oldTimeoutId === null) {
                return { timeoutID: newTimeoutId };
            }
            clearTimeout(oldTimeoutId);

            return { timeoutID: newTimeoutId };
        });
    },
}));

type Text = string;

interface State {
    isShowing: boolean;
    text: Text;
    timeoutID: NodeJS.Timeout | null;
}

interface Actions {
    show: (text: Text, duration?: number) => void;
}

interface StateAndActions extends State, Actions {}

export { useToastStore };
