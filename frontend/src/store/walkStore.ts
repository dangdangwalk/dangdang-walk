import { Position } from '@/models/location.model';
import { create } from 'zustand';

interface WalkState {
    isWalk: boolean;
    routes: Position[];
    walkingDogs: [];
    distance: number;
}
type Actions = {
    addRoutes: (position: Position) => void;
    walkStart: () => void;
    walkStop: () => void;
    increaseDistance: (distance: number) => void;
};

export const useWalkStore = create<WalkState & Actions>((set) => ({
    isWalk: false,
    routes: [],
    distance: 0,
    walkingDogs: [],
    addRoutes: (position: Position) => set((state) => ({ routes: [...state.routes, position] })),
    setWalkingDogs: (dogs: []) => set({ walkingDogs: dogs }),
    increaseDistance: (distance: number) => set((state) => ({ distance: state.distance + distance })),
    walkStart: () => set({ isWalk: true }),
    walkStop: () => set({ isWalk: false }),
}));
