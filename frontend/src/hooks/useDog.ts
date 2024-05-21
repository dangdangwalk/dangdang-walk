import { ResponseDogs, deleteDog, fetchDogs, registerDogInfo } from '@/api/dogs';
import queryClient from '@/api/queryClient';
import { uploadImage } from '@/api/upload';
import { useAuth } from '@/hooks/useAuth';
import { UseMutationCustomOptions } from '@/types/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ProfileUnknown from '@/assets/icons/ic-profile-unknown.svg';
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
        },
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

    return { registerDogMutation, dogs, deleteDogMutation };
};
