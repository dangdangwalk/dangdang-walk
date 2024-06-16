import { createDog, deleteDog, fetchDogs, updateDog } from '@/api/dog';
import queryClient from '@/api/queryClient';
import { uploadImage } from '@/api/upload';
import { FIFTY_MIN, ONE_HOUR, queryKeys } from '@/constants';
import { Dog } from '@/models/dog';
import { useStore } from '@/store';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';

const useCreateDog = (mutationOptions?: UseMutationCustomOptions) => {
    return useMutation({
        mutationFn: createDog,
        ...mutationOptions,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.DOGS] });
        },
    });
};

const useFetchDogs = () => {
    const isSignedIn = useStore((state) => state.isSignedIn);
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
