import useStopWatch from '@/hooks/useStopWatch';
import { useStore } from '@/store';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('@/utils/time', () => ({
    getElapsedTime: vi.fn((startTime, endTime) => Math.floor((endTime - startTime) / 1000)),
}));

describe('useStopWatch', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useStore.setState({ startedAt: '' });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('initializes correctly', () => {
        const { result } = renderHook(() => useStopWatch());

        expect(result.current.isStart).toBe(false);
        expect(result.current.duration).toBe(0);
        expect(result.current.startedAt).toBe('');
    });

    it('starts the clock without a start time', () => {
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock();
        });

        expect(result.current.isStart).toBe(true);
        expect(result.current.startedAt).not.toBe('');
    });

    it('starts the clock with a start time', () => {
        const startTime = new Date().toISOString();

        act(() => {
            useStore.setState({ startedAt: startTime });
        });

        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock();
        });

        expect(result.current.isStart).toBe(true);
        expect(result.current.startedAt).toBe(startTime);
        expect(result.current.duration).toBe(0);
    });

    it('stops the clock', () => {
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock();
        });
        act(() => {
            result.current.stopClock();
        });

        expect(result.current.isStart).toBe(false);
    });

    it('increments the duration when started', () => {
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock();
        });

        act(() => {
            vi.advanceTimersByTime(3000); // Advance time by 3 seconds
        });

        expect(result.current.duration).toBe(3);
    });
    it('set 1hour time when started', async () => {
        const startTime = new Date();
        startTime.setTime(startTime.getTime() - 3600000);

        act(() => {
            useStore.setState({ startedAt: startTime.toISOString() });
        });

        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock();
        });

        expect(result.current.duration).toBe(3600);
        expect(result.current.startedAt).toBe(startTime.toISOString());
        expect(result.current.isStart).toBe(true);

        act(() => {
            vi.advanceTimersByTime(3000); // Advance time by 3 seconds
        });

        expect(result.current.duration).toBe(3603);
    });
});
