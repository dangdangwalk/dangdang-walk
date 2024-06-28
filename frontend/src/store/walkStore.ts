import { WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { DogWalkData } from '@/pages/Walk';
import { StateCreator } from 'zustand';

const initialState: State = {
    dogs: [],
    distance: 0,
    startedAt: '',
    routes: [],
    photoUrls: [],
};

const createWalkSlice: StateCreator<StateAndActions, [['zustand/devtools', never]]> = (set) => ({
    ...initialState,

    setDogs: (dogs: WalkingDog[]) => {
        set({ dogs }, false, 'walk/setWalkingDogs');
    },
    updateDogs: (updateFn) => set((state) => ({ dogs: updateFn(state.dogs) }), false, 'walk/updateDogs'),
    setDistance: (distance: number) => {
        set({ distance }, false, 'walk/setDistance');
    },
    addDistance: (distance: number) => {
        set((state) => ({ distance: state.distance + distance }), false, 'walk/addDistance');
    },
    addRoutes: (route: Position) => {
        set((state) => ({ routes: [...state.routes, route] }), false, 'walk/addRoutes');
    },
    setRoutes: (routes: Position[]) => {
        set({ routes }, false, 'walk/setRoutes');
    },
    setStartedAt: (startedAt: string) => {
        set({ startedAt }, false, 'walk/setStartedAt');
    },
    setPhotoUrls: (photoUrls: string[]) => {
        set((state) => ({ photoUrls: [...state.photoUrls, ...photoUrls] }), false, 'walk/setPhotoUrls');
    },
    resetWalkData: () => {
        set(initialState, false, 'walk/resetWalkData');
    },
});

interface State extends DogWalkData {
    dogs: WalkingDog[];
    routes: Position[];
    distance: number;
    startedAt: string;
    photoUrls: string[];
}
interface Actions {
    setDogs: (dogs: WalkingDog[]) => void;
    updateDogs: (updateFn: (dogs: WalkingDog[]) => WalkingDog[]) => void;
    setDistance: (distance: number) => void;
    addDistance: (distance: number) => void;
    addRoutes: (routes: Position) => void;
    setRoutes: (routes: Position[]) => void;
    setStartedAt: (startedAt: string) => void;
    setPhotoUrls: (photoUrls: string[]) => void;
    resetWalkData: () => void;
}
export interface StateAndActions extends State, Actions {}

export { createWalkSlice };
