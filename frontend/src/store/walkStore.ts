import { DogAvatar, WalkingDog } from '@/models/dog';
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

    initialSetDogs: (dogs) => {
        set(
            {
                dogs: dogs.map((dog) => ({
                    ...dog,
                    isFecesChecked: false,
                    isUrineChecked: false,
                    fecesLocations: (dog as WalkingDog).fecesLocations || [],
                    urineLocations: (dog as WalkingDog).urineLocations || [],
                })),
            },
            false,
            'walk/initialSetDogs'
        );
    },
    setDistance: (distance: number) => {
        set({ distance }, false, 'walk/setDistance');
    },
    addDistance: (distance: number) => {
        set(
            (state) => {
                return {
                    ...state,
                    distance: state.distance + distance,
                };
            },
            false,
            'walk/addDistance'
        );
    },
    addRoutes: (route: Position) => {
        set(
            (state) => {
                return {
                    ...state,
                    routes: [...state.routes, route],
                };
            },

            false,
            'walk/addRoutes'
        );
    },
    setRoutes: (routes: Position[]) => {
        set({ routes }, false, 'walk/setRoutes');
    },
});

interface State extends DogWalkData {
    dogs: WalkingDog[];
    routes: Position[];
    distance: number;
}
interface Actions {
    initialSetDogs: (dogs: WalkingDog[] | DogAvatar[]) => void;
    setDistance: (distance: number) => void;
    addDistance: (distance: number) => void;
    addRoutes: (routes: Position) => void;
    setRoutes: (routes: Position[]) => void;
}
export interface StateAndActions extends State, Actions {}

export { createWalkSlice };
