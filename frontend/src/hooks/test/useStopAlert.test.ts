import useStopAlert from '@/hooks/useStopAlert';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

describe('useStopAlert', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    it('initializes with alert not shown', () => {
        const { result } = renderHook(() => useStopAlert());

        expect(result.current.isShowStopAlert).toBe(false);
    });

    it('shows the alert when showStopAlert is called and hides the alert after 1 second', () => {
        const { result } = renderHook(() => useStopAlert());

        act(() => {
            result.current.showStopAlert();
        });

        expect(result.current.isShowStopAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.isShowStopAlert).toBe(false);
    });

    it('clears previous timeout if showStopAlert is called again', () => {
        const { result } = renderHook(() => useStopAlert());

        act(() => {
            result.current.showStopAlert();
        });

        expect(result.current.isShowStopAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500); // Advance half of the timeout duration
        });

        act(() => {
            result.current.showStopAlert(); // Call showStopAlert again before the previous timeout completes
        });

        expect(result.current.isShowStopAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500); // The previous timeout would have completed here, but we reset it
        });

        expect(result.current.isShowStopAlert).toBe(true); // Still true because we reset the timer

        act(() => {
            vi.advanceTimersByTime(500); // Complete the new timeout duration
        });

        expect(result.current.isShowStopAlert).toBe(false); // Now it should be false
    });
});
