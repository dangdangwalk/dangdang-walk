import { WalkingDog } from '@/models/dog';
import { Coords } from '@/models/location';
import { StateCreator } from 'zustand';

const initialState: State = {
    walkingDogs: [],
    distance: 0,
    startedAt: '',
    routes: [],
    journalPhotos: [],
};

const createWalkSlice: StateCreator<StateAndActions, [['zustand/devtools', never], ['zustand/persist', unknown]]> = (
    set
) => ({
    ...initialState,

    setWalkingDogs: (dogs: WalkingDog[]) => {
        set({ walkingDogs: dogs }, false, 'walk/setWalkingDogs');
    },
    updateWalkingDogs: (updateFn) =>
        set((state) => ({ walkingDogs: updateFn(state.walkingDogs) }), false, 'walk/updateDogs'),
    setDistance: (distance: number) => {
        set({ distance }, false, 'walk/setDistance');
    },
    addDistance: (distance: number) => {
        set((state) => ({ distance: state.distance + distance }), false, 'walk/addDistance');
    },
    addRoutes: (route: Coords) => {
        set((state) => ({ routes: [...state.routes, route] }), false, 'walk/addRoutes');
    },
    setRoutes: (routesOrUpdateFn: Coords[] | ((prevRoutes: Coords[]) => Coords[])) => {
        set(
            (state) => ({
                routes: typeof routesOrUpdateFn === 'function' ? routesOrUpdateFn(state.routes) : routesOrUpdateFn,
            }),
            false,
            'walk/setRoutes'
        );
    },
    setStartedAt: (startedAt: string) => {
        set({ startedAt }, false, 'walk/setStartedAt');
    },
    setJournalPhotos: (journalPhotos: string[]) => {
        set((state) => ({ journalPhotos: [...state.journalPhotos, ...journalPhotos] }), false, 'walk/setJournalPhotos');
    },
    resetWalkData: () => {
        set(initialState, false, 'walk/resetWalkData');
    },
});

interface State {
    walkingDogs: WalkingDog[];
    routes: Coords[];
    distance: number;
    startedAt: string;
    journalPhotos: string[];
}
interface Actions {
    setWalkingDogs: (dogs: WalkingDog[]) => void;
    updateWalkingDogs: (updateFn: (dogs: WalkingDog[]) => WalkingDog[]) => void;
    setDistance: (distance: number) => void;
    addDistance: (distance: number) => void;
    addRoutes: (routes: Coords) => void;
    setRoutes: (routesOrUpdateFn: Coords[] | ((prevRoutes: Coords[]) => Coords[])) => void;
    setStartedAt: (startedAt: string) => void;
    setJournalPhotos: (journalPhotos: string[]) => void;
    resetWalkData: () => void;
}
export interface StateAndActions extends State, Actions {}

export { createWalkSlice };
