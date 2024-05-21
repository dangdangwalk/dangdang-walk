import { ResponseDogs, deleteDog, fetchDogs, registerDogInfo, updateDog } from '@/api/dogs';
import queryClient from '@/api/queryClient';
import { uploadImage } from '@/api/upload';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ProfileUnknown from '@/assets/icons/ic-profile-unknown.svg';
import { useAuth } from '@/hooks/useAuth';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

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
    const { refreshTokenQuery } = useAuth();
    const { data, isSuccess, isError } = useQuery<ResponseDogs[]>({
        queryKey: ['dogs'],
        queryFn: fetchDogs,
        enabled: refreshTokenQuery.isSuccess,
    });
    if (isSuccess) {
        return data?.map((dog: ResponseDogs) => {
            return {
                ...dog,
                profilePhotoUrl:
                    dog.profilePhotoUrl === null
                        ? ProfileUnknown
                        : `${REACT_APP_BASE_IMAGE_URL}/${dog.profilePhotoUrl}`,
            };
        });
    }
    if (isError) {
        return [
            {
                id: 0,
                weight: 0,
                name: '',
                breed: '',
                gender: '',
                isNeutered: true,
                birth: null,
                profilePhotoUrl: '',
            },
        ];
    }
};

const useDeleteDog = () => {
    return useMutation({
        mutationFn: deleteDog,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['dogs'] });
            window.location.reload();
        },
    });
};

const useUpdateDog = (mutationOptions?: UseMutationCustomOptions) => {
    return useMutation({
        mutationFn: updateDog,
        onSuccess: () => {
            window.location.reload();
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
    const dogs = useFetchDogs();
    const deleteDogMutation = useDeleteDog();
    const updateDogMutation = useUpdateDog();

    return { registerDogMutation, dogs, deleteDogMutation, updateDogMutation };
};
