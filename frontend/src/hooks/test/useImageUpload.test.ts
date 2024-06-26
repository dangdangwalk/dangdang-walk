import useImageUpload from '@/hooks/useImageUpload';
import { renderHook, waitFor } from '@testing-library/react';
import { ChangeEvent, act } from 'react';
import { vi } from 'vitest';

// Mocking the useToast hook
vi.mock('@/hooks/useToast', () => ({
    default: () => ({
        show: vi.fn(),
    }),
}));

describe('useImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes correctly', () => {
        const { result } = renderHook(() => useImageUpload());

        expect(result.current.selectedFiles).toEqual([]);
        expect(result.current.uploadedImageUrls).toEqual([]);
    });

    it('handles file change', async () => {
        const { result } = renderHook(() => useImageUpload());
        const files: File[] = [new File(['content'], '테스트', { type: 'image/png' })];
        const event = { target: { files } as unknown as HTMLInputElement } as ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        expect(result.current.selectedFiles).toEqual(files);

        await waitFor(() => expect(result.current.selectedFiles).toHaveLength(0));

        const uploadedFiles = files.map((file) => `filename.${file.type}`);
        expect(result.current.uploadedImageUrls).toEqual(uploadedFiles);
        expect(result.current.selectedFiles).toEqual([]);
    });

    it('handle multiFile change', async () => {
        const { result } = renderHook(() => useImageUpload());
        const files: File[] = [
            new File(['content'], '테스트', { type: 'image/png' }),
            new File(['content'], '테스트', { type: 'image/jpg' }),
        ];
        const event = { target: { files } as unknown as HTMLInputElement } as ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        expect(result.current.selectedFiles).toEqual(files);

        await waitFor(() => expect(result.current.selectedFiles).toHaveLength(0));

        const uploadedFiles = files.map((file) => `filename.${file.type}`);

        expect(result.current.uploadedImageUrls).toEqual(uploadedFiles);
        expect(result.current.selectedFiles).toEqual([]);
    });
});
