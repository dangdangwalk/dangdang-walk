import { registerDogInfo } from '@/api/dogs';
import { uploadImage } from '@/api/upload';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const useRegisterDog = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: registerDogInfo,
        ...mutationOptions,
        onSuccess: async () => {
            navigate('/');
        },
    });
};

export const uploadImg = async (file: File | null, dogImgUrl: string) => {
    if (!file) return;
    await uploadImage(file, dogImgUrl);
};

export const useDog = () => {
    const registerDogMutation = useRegisterDog();

    return { registerDogMutation };
};
