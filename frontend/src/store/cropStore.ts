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

export const createCropSlice: StateCreator<CropState, [['zustand/devtools', never]]> = (set) => ({
    crop: undefined,
    cropError: false,
    cropperToggle: false,
    cropPrevImgUrl: '',
    dogProfileImgUrl: '',
    setCrop: (crop: PercentCrop | undefined) => set({ crop }, false, 'crop/setCrop'),
    setCropError: (state: boolean) => set({ cropError: state }, false, 'crop/setCropError'),
    setCropperToggle: (toggle: boolean) => set({ cropperToggle: toggle }, false, 'crop/setCropperToggle'),
    setCropPrevImgUrl: (cropPrevImgUrl: string) => set({ cropPrevImgUrl }, false, 'crop/setCropPrevImgUrl'),
    setDogProfileImgUrl: (url: string) => set({ dogProfileImgUrl: url }, false, 'crop/setDogProfileImgUrl'),
    onSelectFileChange: (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];

        if (!files) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || '';
            imageElement.src = imageUrl;

            imageElement.addEventListener('load', (e) => {
                set(
                    (state) => {
                        const cropError = state.cropError;
                        if (cropError) return { cropError: false };
                        const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
                        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                            return { crop: undefined, cropError: true, cropperToggle: false };
                        } else {
                            return { cropPrevImgUrl: imageUrl, cropperToggle: true };
                        }
                    },
                    false,
                    'crop/onSelectFileChange'
                );
            });
        });

        reader.readAsDataURL(files);
        e.currentTarget.value = '';
    },
});
