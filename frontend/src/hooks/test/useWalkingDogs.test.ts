import useWalkingDogs from '@/hooks/useWalkingDogs';
import { DogAvatar, WalkingDog } from '@/models/dog';
import { Position } from '@/models/location';
import { useStore } from '@/store';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

describe('useWalkingDogs', () => {
    const initialDogs: WalkingDog[] = [
        {
            id: 1,
            name: 'Dog 1',
            profilePhotoUrl: null,
            fecesLocations: [],
            urineLocations: [],
        },
        {
            id: 2,
            name: 'Dog 2',
            profilePhotoUrl: null,
            fecesLocations: [],
            urineLocations: [],
        },
    ];
    beforeEach(() => {
        useStore.setState({ walkingDogs: [] });
    });

    it('initializes walking dogs correctly', () => {
        const { result } = renderHook(() => useWalkingDogs());
        const initialDogs: DogAvatar[] = [
            {
                id: 1,
                name: 'Dog 1',
                profilePhotoUrl: null,
            },
            {
                id: 2,
                name: 'Dog 2',
                profilePhotoUrl: null,
            },
        ];
        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        expect(result.current.walkingDogs).toEqual(
            initialDogs.map((dog) => ({
                ...dog,
                fecesLocations: [],
                urineLocations: [],
            }))
        );
    });

    it('toggles check correctly', () => {
        const { result } = renderHook(() => useWalkingDogs());

        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        act(() => {
            result.current.handleToggle(2, 'feces');
        });

        expect(result.current.fecesCheckedList.has(2)).toEqual(true);

        act(() => {
            result.current.handleToggle(1, 'urine');
        });

        expect(result.current.urineCheckedList.has(1)).toEqual(true);

        act(() => {
            result.current.handleToggle(1, 'urine');
            result.current.handleToggle(2, 'feces');
        });

        expect(result.current.urineCheckedList.size).toEqual(0);
        expect(result.current.fecesCheckedList.size).toEqual(0);
    });

    it('cancels all checks correctly', () => {
        const { result } = renderHook(() => useWalkingDogs());

        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        act(() => {
            result.current.handleToggle(1, 'urine');
            result.current.handleToggle(2, 'feces');
        });

        expect(result.current.urineCheckedList.has(1)).toEqual(true);
        expect(result.current.fecesCheckedList.has(2)).toEqual(true);

        act(() => {
            result.current.cancelCheckedAll();
        });

        expect(result.current.urineCheckedList.size).toEqual(0);
        expect(result.current.fecesCheckedList.size).toEqual(0);
    });

    it('saves feces and urine locations correctly', () => {
        const { result } = renderHook(() => useWalkingDogs());
        const position: Position = { lat: 10, lng: 20 };

        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        act(() => {
            result.current.saveFecesAndUrine(position);
        });

        const expectedDogs = initialDogs.map((dog) => ({
            ...dog,
            fecesLocations: [],
            urineLocations: [],
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs);

        act(() => {
            result.current.handleToggle(1, 'urine');
            result.current.handleToggle(2, 'feces');
        });

        act(() => {
            result.current.saveFecesAndUrine(position);
        });

        const expectedDogs1 = expectedDogs.map((dog) => ({
            ...dog,
            fecesLocations: dog.id === 2 ? [[10, 20]] : [],
            urineLocations: dog.id === 1 ? [[10, 20]] : [],
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs1);
        expect(result.current.urineCheckedList.size).toEqual(0);
        expect(result.current.fecesCheckedList.size).toEqual(0);
    });

    it('does not update locations if no position is provided', () => {
        const { result } = renderHook(() => useWalkingDogs());

        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        act(() => {
            result.current.saveFecesAndUrine(null);
        });

        expect(result.current.walkingDogs).toEqual(
            initialDogs.map((dog) => ({
                ...dog,
                fecesLocations: [],
                urineLocations: [],
            }))
        );
    });

    it('does not update locations if walkingDogs is null', () => {
        const { result } = renderHook(() => useWalkingDogs());
        const position: Position = { lat: 10, lng: 20 };

        act(() => {
            result.current.saveFecesAndUrine(position);
        });

        expect(result.current.walkingDogs).toHaveLength(0);
    });
});
