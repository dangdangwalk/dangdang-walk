import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants';
import useGeolocation from '@/hooks/useGeolocation';
import { useStore } from '@/store';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi, expect } from 'vitest';

vi.mock('@/utils/geo', () => ({
    calculateDistance: vi.fn(() => 1),
}));

const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
};

const originalGeolocation = global.navigator.geolocation;

const mockNavigator = {
    geolocation: mockGeolocation,
};

beforeAll(() => {
    global.navigator = mockNavigator as any;
});

afterAll(() => {
    global.navigator = originalGeolocation as any;
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('useGeolocation', () => {
    beforeEach(() => {
        useStore.setState({ routes: [], distance: 0 });
    });

    test('sets initial position and handles geolocation success', async () => {
        const startPosition = { coords: { latitude: 10, longitude: 20 } };

        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success(startPosition));

        const { result } = renderHook(() => useGeolocation());

        expect(result.current.position).toEqual({ lat: 10, lng: 20 });
        expect(result.current.isLocationDisabled).toBe(false);
    });

    test('handles geolocation denied set default position', async () => {
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => error());

        const { result } = renderHook(() => useGeolocation());

        expect(result.current.position).toEqual({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        expect(result.current.isLocationDisabled).toBe(true);
    });

    test('starts and stops geolocation tracking', async () => {
        const position = { coords: { latitude: 10, longitude: 20 } };

        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success(position));
        mockGeolocation.watchPosition.mockImplementation((success) => {
            success(position);
            return 1; // watchId
        });
        const { result, unmount } = renderHook(() => useGeolocation());

        expect(result.current.currentPosition).toEqual(null);

        act(() => {
            result.current.startGeo(0, []);
        });

        expect(result.current.position).toEqual({ lat: 10, lng: 20 });
        expect(result.current.currentPosition).toEqual({ lat: 10, lng: 20 });
        expect(result.current.isStartGeo).toBe(true);

        expect(result.current.distance).toBe(0);

        act(() => {
            result.current.stopGeo();
        });

        expect(result.current.isStartGeo).toBe(false);

        unmount();
        expect(mockGeolocation.clearWatch).toBeCalled();
    });

    test('updates distance and routes correctly', async () => {
        const startPosition = { coords: { latitude: 10, longitude: 20 } };

        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success(startPosition));
        mockGeolocation.watchPosition.mockImplementation((success) => {
            success(startPosition);
            return 1;
        });

        const { result } = renderHook(() => useGeolocation());

        act(() => {
            result.current.startGeo(0, []);
        });

        expect(result.current.isStartGeo).toBe(true);
        expect(result.current.distance).toBe(0);
        expect(result.current.routes).toEqual([{ lat: 10, lng: 20 }]);

        act(() => {
            result.current.setCurrentPosition({ lat: 20, lng: 25 });
        });
        expect(result.current.distance).toBe(1);
        expect(result.current.routes).toEqual([
            { lat: 10, lng: 20 },
            { lat: 20, lng: 25 },
        ]);
    });

    test('geolocation 시작시 초기 설정 correctly', async () => {
        const startPosition = { coords: { latitude: 10, longitude: 20 } };

        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => success(startPosition));
        mockGeolocation.watchPosition.mockImplementation((success) => success(startPosition));

        const { result } = renderHook(() => useGeolocation());

        act(() => {
            result.current.startGeo(3, [
                { lat: 10, lng: 20 },
                { lat: 20, lng: 30 },
                { lat: 30, lng: 40 },
            ]);
        });

        expect(result.current.isStartGeo).toBe(true);
        expect(result.current.distance).toBe(4);
        expect(result.current.routes).toEqual([
            { lat: 10, lng: 20 },
            { lat: 20, lng: 30 },
            { lat: 30, lng: 40 },
            { lat: 10, lng: 20 },
        ]);
    });
});
