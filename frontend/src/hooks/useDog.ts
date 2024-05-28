import { ResponseDogs, deleteDog, fetchDogs, registerDogInfo, updateDog } from '@/api/dogs';
import queryClient from '@/api/queryClient';
import { uploadImage } from '@/api/upload';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { queryKeys } from '@/constants';

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

const useFetchDogs = () => {
    return useQuery<ResponseDogs[]>({
        queryKey: [queryKeys.DOGS],
        queryFn: fetchDogs,
    });
};

const useDeleteDog = () => {
    return useMutation({
        mutationFn: deleteDog,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
            window.location.reload();
        },
    });
};

const useUpdateDog = (mutationOptions?: UseMutationCustomOptions) => {
    return useMutation({
        mutationFn: updateDog,
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
        },
        ...mutationOptions,
    });
};

export const uploadImg = async (file: File | null, dogImgUrl: string) => {
    if (!file) return;
    await uploadImage(file, dogImgUrl);
};

export const useDog = () => {
    const registerDogMutation = useRegisterDog();
    const useDogsQuery = useFetchDogs();
    const deleteDogMutation = useDeleteDog();
    const updateDogMutation = useUpdateDog();

    return { registerDogMutation, useDogsQuery, deleteDogMutation, updateDogMutation };
};
