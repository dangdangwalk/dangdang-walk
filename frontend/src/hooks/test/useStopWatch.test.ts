import useStopWatch from '@/hooks/useStopWatch';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

vi.mock('@/utils/time', () => ({
    getElapsedTime: vi.fn((startTime, endTime) => Math.floor((endTime - startTime) / 1000)),
}));

describe('useStopWatch', () => {
    beforeEach(() => {
        vi.useFakeTimers();
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
            result.current.startClock(undefined);
        });

        expect(result.current.isStart).toBe(true);
        expect(result.current.startedAt).not.toBe('');
    });

    it('starts the clock with a start time', () => {
        const startTime = new Date().toISOString();
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock(startTime);
        });

        expect(result.current.isStart).toBe(true);
        expect(result.current.startedAt).toBe(startTime);
        expect(result.current.duration).toBe(0);
    });

    it('stops the clock', () => {
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock(undefined);
        });
        act(() => {
            result.current.stopClock();
        });

        expect(result.current.isStart).toBe(false);
    });

    it('increments the duration when started', () => {
        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock(undefined);
        });

        act(() => {
            vi.advanceTimersByTime(3000); // Advance time by 3 seconds
        });

        expect(result.current.duration).toBe(3);
    });
    it('set 1hour time when started', async () => {
        const startTime = new Date();
        startTime.setTime(startTime.getTime() - 3600000);

        const { result } = renderHook(() => useStopWatch());

        act(() => {
            result.current.startClock(startTime.toString());
        });

        expect(result.current.duration).toBe(3600);
        expect(result.current.startedAt).toBe(startTime.toString());
        expect(result.current.isStart).toBe(true);

        act(() => {
            vi.advanceTimersByTime(3000); // Advance time by 3 seconds
        });

        expect(result.current.duration).toBe(3603);
    });
});
