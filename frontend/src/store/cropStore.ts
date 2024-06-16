import { MIN_DIMENSION } from '@/constants';
import { ChangeEvent } from 'react';
import { PercentCrop } from 'react-image-crop';
import { StateCreator } from 'zustand';
export interface CropState {
    crop: PercentCrop | undefined;
    cropError: boolean;
    cropperToggle: boolean;
    cropPrevImgUrl: string;
    dogProfileImgUrl: string;
    setCrop: (crop: PercentCrop | undefined) => void;
    setCropError: (state: boolean) => void;
    setCropperToggle: (toggle: boolean) => void;
    setCropPrevImgUrl: (cropPrevImgUrl: string) => void;
    setDogProfileImgUrl: (url: string) => void;
    onSelectFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const createCropSlice: StateCreator<CropState> = (set) => ({
    crop: undefined,
    cropError: false,
    cropperToggle: false,
    cropPrevImgUrl: '',
    dogProfileImgUrl: '',
    setCrop: (crop: PercentCrop | undefined) => set({ crop }),
    setCropError: (state: boolean) => set({ cropError: state }),
    setCropperToggle: (toggle: boolean) => set({ cropperToggle: toggle }),
    setCropPrevImgUrl: (cropPrevImgUrl: string) => set({ cropPrevImgUrl }),
    setDogProfileImgUrl: (url: string) => set({ dogProfileImgUrl: url }),
    onSelectFileChange: (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];

        if (!files) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || '';
            imageElement.src = imageUrl;

            imageElement.addEventListener('load', (e) => {
                set((state) => {
                    const cropError = state.cropError;
                    if (cropError) return { cropError: false };
                    const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
                    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                        return { crop: undefined, cropError: true, cropperToggle: false };
                    } else {
                        return { cropPrevImgUrl: imageUrl, cropperToggle: true };
                    }
                });
            });
        });

        reader.readAsDataURL(files);
        e.currentTarget.value = '';
    },
});
