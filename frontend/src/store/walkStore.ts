import { Position } from '@/models/location.model';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const WALK_MET = 3;
const WEIGHT = 70;

interface WalkState {
    isWalk: boolean;
    routes: Position[];
    walkingDogs: [];
    distance: number;
    startedAt: string;
    duration: number;
    startPosition: Position | null;
    currentPosition: Position | null;
    calories: number;
}
type Actions = {
    addRoutes: (position: Position) => void;
    walkStart: (date: Date) => void;
    walkStop: () => void;
    increaseDistance: (distance: number) => void;
    increaseDuration: () => void;
    setStartPosition: (position: Position | null) => void;
    setCurrentPosition: (position: Position | null) => void;
    setCalories: () => void;
};

const setStartTime = (date: Date) => {
    localStorage.setItem('startedAt', date.toISOString());
};
export const useWalkStore = create<WalkState & Actions>()(
    devtools((set) => ({
        isWalk: false,
        routes: [],
        distance: 0,
        startedAt: '',
        duration: 0,
        walkingDogs: [],
        startPosition: null,
        currentPosition: null,
        calories: 0,
        addRoutes: (position: Position) => set((state) => ({ routes: [...state.routes, position] })),
        setWalkingDogs: (dogs: []) => set({ walkingDogs: dogs }),
        setCalories: () => set((state) => ({ calories: Math.round((WALK_MET * WEIGHT * state.duration) / 3600) })),
        increaseDistance: (distance: number) => set((state) => ({ distance: state.distance + distance })),
        increaseDuration: () => set((state) => ({ duration: state.duration + 1 })),
        setStartPosition: (position) => set({ startPosition: position }),
        setCurrentPosition: (position) => set({ currentPosition: position }),
        walkStart: (date: Date) => {
            set({ isWalk: true, startedAt: date.toISOString() });
            setStartTime(date);
        },

        walkStop: () => set({ isWalk: false }),
    }))
);
