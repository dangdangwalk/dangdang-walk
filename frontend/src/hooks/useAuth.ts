import {
    ProfileResponse,
    SignInResponse,
    refreshAccessToken,
    requestDeactivate,
    requestProfile,
    requestSignIn,
    requestSignOut,
    requestSignUp,
} from '@/api/auth';
import queryClient from '@/api/queryClient';
import { FIFTY_MIN, ONE_DAY_IN_MS, ONE_HOUR, TEN_TO_A_DAY, queryKeys, storageKeys } from '@/constants';
import { useStore } from '@/store';
import { UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';
import { getStorage, removeStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSignIn = (mutationOptions?: UseMutationCustomOptions) => {
    const storeSignIn = useStore((state) => state.storeSignIn);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: requestSignIn,
        onSuccess: ({ accessToken }: SignInResponse) => {
            const url = getStorage(storageKeys.REDIRECT_URI) || '';
            storeSignIn(accessToken);
            navigate(url);
        },
        onError: (error) => {
            if (error.response && error.response.status === 404) {
                navigate('/signup');
            }
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.GET_ACCESS_TOKEN] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.GET_PROFILE] });
        },
        ...mutationOptions,
    });
};

const useSignUp = (mutationOptions?: UseMutationCustomOptions) => {
    const storeSignIn = useStore((state) => state.storeSignIn);
    return useMutation({
        mutationFn: requestSignUp,
        onSuccess: ({ accessToken }: SignInResponse) => {
            storeSignIn(accessToken);
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.GET_ACCESS_TOKEN] });
        },
        ...mutationOptions,
    });
};

const useGetRefreshToken = () => {
    const storeSignIn = useStore((state) => state.storeSignIn);
    const { isSuccess, data, isLoading } = useQuery({
        queryKey: [queryKeys.GET_ACCESS_TOKEN],
        queryFn: refreshAccessToken,
        gcTime: ONE_HOUR,
        staleTime: FIFTY_MIN,
        refetchInterval: FIFTY_MIN,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
    });
    useEffect(() => {
        if (isSuccess) {
            storeSignIn(data?.accessToken);
        }
    }, [isSuccess, data]);

    return { isSuccess, data, isLoading };
};

const useSignOut = (mutationOptions?: UseMutationCustomOptions) => {
    const storeSignOut = useStore((state) => state.storeSignOut);
    return useMutation({
        mutationFn: requestSignOut,
        onSuccess: () => {
            removeStorage(storageKeys.REDIRECT_URI);
            removeStorage(storageKeys.PROVIDER);
            queryClient.resetQueries({ queryKey: [queryKeys.AUTH] });
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
        },
        onSettled: () => {
            storeSignOut();
            window.location.href = '/';
        },
        ...mutationOptions,
    });
};

const useDeactivate = (mutationOptions?: UseMutationCustomOptions) => {
    const storeSignOut = useStore((state) => state.storeSignOut);
    return useMutation({
        mutationFn: requestDeactivate,
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: [queryKeys.AUTH] });
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
        },
        onSettled: () => {
            storeSignOut();
            window.location.href = '/';
        },
        ...mutationOptions,
    });
};

const useGetProfile = (queryOptions?: UseQueryCustomOptions) => {
    return useQuery({
        queryKey: [queryKeys.GET_PROFILE],
        queryFn: requestProfile,
        gcTime: ONE_DAY_IN_MS,
        staleTime: TEN_TO_A_DAY,
        ...queryOptions,
    });
};
export const useAuth = () => {
    const signIn = useSignIn();
    const signOut = useSignOut();
    const signUp = useSignUp();
    const refreshTokenQuery = useGetRefreshToken();
    const getProfileQuery = useGetProfile({ enabled: refreshTokenQuery.isSuccess });
    const deactivate = useDeactivate();
    return {
        signIn,
        signOut,
        signUp,
        refreshTokenQuery,
        deactivate,
        profileData: getProfileQuery.data as ProfileResponse,
    };
};
