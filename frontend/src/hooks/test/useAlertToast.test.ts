import useAlertToast from '@/hooks/useAlertToast';
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
        const { result } = renderHook(() => useAlertToast());

        expect(result.current.isShowAlert).toBe(false);
    });

    it('shows the alert when showAlertToast is called and hides the alert after 1 second', () => {
        const { result } = renderHook(() => useAlertToast());

        act(() => {
            result.current.showAlertToast();
        });

        expect(result.current.isShowAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.isShowAlert).toBe(false);
    });

    it('clears previous timeout if showAlertToast is called again', () => {
        const { result } = renderHook(() => useAlertToast());

        act(() => {
            result.current.showAlertToast();
        });

        expect(result.current.isShowAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500); // Advance half of the timeout duration
        });

        act(() => {
            result.current.showAlertToast(); // Call showAlertToast again before the previous timeout completes
        });

        expect(result.current.isShowAlert).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500); // The previous timeout would have completed here, but we reset it
        });

        expect(result.current.isShowAlert).toBe(true); // Still true because we reset the timer

        act(() => {
            vi.advanceTimersByTime(500); // Complete the new timeout duration
        });

        expect(result.current.isShowAlert).toBe(false); // Now it should be false
    });
});
