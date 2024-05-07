import { create } from 'zustand';

interface WalkState {
    isWalk: boolean;
}

export const useWalkStore = create<WalkState>((set) => ({
    isWalk: false,
    walkStart: () => set({ isWalk: true }),
    walkStop: () => set({ isWalk: false }),
}));
