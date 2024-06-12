import { deleteDog, fetchDogs, createDog, updateDog } from '@/api/dog';
import queryClient from '@/api/queryClient';
import { uploadImage } from '@/api/upload';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FIFTY_MIN, ONE_HOUR, queryKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { Dog } from '@/models/dog';

const useCreateDog = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createDog,
        ...mutationOptions,
        onSuccess: async () => {
            navigate('/');
        },
    });
};

const useFetchDogs = () => {
    const { isSignedIn } = useAuthStore();
    return useQuery<Dog[]>({
        queryKey: [queryKeys.DOGS],
        queryFn: fetchDogs,
        gcTime: ONE_HOUR,
        staleTime: FIFTY_MIN,
        enabled: isSignedIn,
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
    const createDog = useCreateDog();
    const fetchDog = useFetchDogs();
    const deleteDog = useDeleteDog();
    const updateDog = useUpdateDog();

    return { createDog, fetchDog, deleteDog, updateDog };
};
