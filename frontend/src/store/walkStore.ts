import { Dog } from '@/models/dog.model';
import { Position } from '@/models/location.model';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WalkingDog extends Dog {
    isUrineChecked: boolean;
    isFeceChecked: boolean;
}
const dogs = [
    {
        id: 1, // 강아지 id
        name: '덕지', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/001.jpg', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
    {
        id: 2, // 강아지 id
        name: '철도', //강아지 이름
        photoUrl: 'https://ai.esmplus.com/pixie2665/002.jpg', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
    {
        id: 3, // 강아지 id
        name: '', //강아지 이름
        photoUrl: '', // 강아지 사진
        isUrineChecked: false,
        isFeceChecked: false,
    },
];

const WALK_MET = 3;
const WEIGHT = 70;

interface WalkState {
    isWalk: boolean;
    routes: Position[];
    walkingDogs: WalkingDog[];
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
        walkingDogs: [...dogs],
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
