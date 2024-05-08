import { Position } from '@/models/location.model';
import { create } from 'zustand';

interface WalkState {
    isWalk: boolean;
    routes: Position[];
    walkingDogs: [];
    distance: number;
    startedAt: string;
    duration: number;
}
type Actions = {
    addRoutes: (position: Position) => void;
    walkStart: (date: Date) => void;
    walkStop: () => void;
    increaseDistance: (distance: number) => void;
    setDuration: (time: number) => void;
};

const setStartTime = (date: Date) => {
    localStorage.setItem('startedAt', date.toISOString());
};

export const useWalkStore = create<WalkState & Actions>((set) => ({
    isWalk: false,
    routes: [],
    distance: 0,
    startedAt: '',
    duration: 0,
    walkingDogs: [],
    addRoutes: (position: Position) => set((state) => ({ routes: [...state.routes, position] })),
    setWalkingDogs: (dogs: []) => set({ walkingDogs: dogs }),
    increaseDistance: (distance: number) => set((state) => ({ distance: state.distance + distance })),
    setDuration: (time: number) => set((state) => ({ duration: state.duration + time })),
    walkStart: (date: Date) => {
        set({ isWalk: true, startedAt: date.toISOString() });
        setStartTime(date);
    },

    walkStop: () => set({ isWalk: false }),
}));
