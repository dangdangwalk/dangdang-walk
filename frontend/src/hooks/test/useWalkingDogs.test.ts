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
            isFecesChecked: false,
            isUrineChecked: false,
            fecesLocations: [],
            urineLocations: [],
        },
        {
            id: 2,
            name: 'Dog 2',
            profilePhotoUrl: null,
            isFecesChecked: false,
            isUrineChecked: false,
            fecesLocations: [],
            urineLocations: [],
        },
    ];
    beforeEach(() => {
        useStore.setState({ dogs: [] });
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
                isFecesChecked: false,
                isUrineChecked: false,
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
            result.current.handleToggle(2, 'isFecesChecked');
        });

        const expectedDogs = initialDogs.map((dog) => ({
            ...dog,
            isFecesChecked: dog.id === 2 ? !dog.isFecesChecked : dog.isFecesChecked,
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs);

        act(() => {
            result.current.handleToggle(1, 'isUrineChecked');
        });

        const expectedDogs1 = expectedDogs.map((dog) => ({
            ...dog,
            isUrineChecked: dog.id === 1 ? !dog.isUrineChecked : dog.isUrineChecked,
        }));
        expect(result.current.walkingDogs).toEqual(expectedDogs1);

        act(() => {
            result.current.handleToggle(1, 'isUrineChecked');
            result.current.handleToggle(2, 'isFecesChecked');
        });
        const expectedDogs2 = expectedDogs1.map((dog) => ({
            ...dog,
            isUrineChecked: dog.id === 1 ? !dog.isUrineChecked : dog.isUrineChecked,
            isFecesChecked: dog.id === 2 ? !dog.isFecesChecked : dog.isFecesChecked,
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs2);
    });

    it('cancels all checks correctly', () => {
        const { result } = renderHook(() => useWalkingDogs());

        act(() => {
            result.current.initialSetDogs(initialDogs);
        });

        act(() => {
            result.current.handleToggle(1, 'isUrineChecked');
            result.current.handleToggle(2, 'isFecesChecked');
        });
        const expectedDogs = initialDogs.map((dog) => ({
            ...dog,
            isUrineChecked: dog.id === 1 ? !dog.isUrineChecked : dog.isUrineChecked,
            isFecesChecked: dog.id === 2 ? !dog.isFecesChecked : dog.isFecesChecked,
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs);

        act(() => {
            result.current.cancelCheckedAll();
        });

        const expectedDogs1 = initialDogs.map((dog) => ({
            ...dog,
            isFecesChecked: false,
            isUrineChecked: false,
        }));

        expect(result.current.walkingDogs).toEqual(expectedDogs1);
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
            isFecesChecked: false,
            isUrineChecked: false,
        }));
        expect(result.current.walkingDogs).toEqual(expectedDogs);

        act(() => {
            result.current.handleToggle(1, 'isUrineChecked');
            result.current.handleToggle(2, 'isFecesChecked');
            result.current.saveFecesAndUrine(position);
        });

        const expectedDogs1 = expectedDogs.map((dog) => ({
            ...dog,
            fecesLocations: dog.id === 2 ? [{ lat: 10, lng: 20 }] : [],
            urineLocations: dog.id === 1 ? [{ lat: 10, lng: 20 }] : [],
        }));
        expect(result.current.walkingDogs).toEqual(expectedDogs1);
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
                isFecesChecked: false,
                isUrineChecked: false,
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
