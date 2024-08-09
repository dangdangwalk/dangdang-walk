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

export const useSignIn = (mutationOptions?: UseMutationCustomOptions) => {
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

export const useSignUp = (mutationOptions?: UseMutationCustomOptions) => {
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

//TODO: 로그인 내부로직 react-query에서 interceptor로 변경
export const useRefreshToken = () => {
    const storeSignIn = useStore((state) => state.storeSignIn);
    const isAuthLoading = useStore((state) => state.isAuthLoading);
    const setIsAuthLoading = useStore((state) => state.setIsAuthLoading);
    const {
        isSuccess,
        data,
        isLoading: isTokenLoading,
        isPending,
        isError,
    } = useQuery({
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
            removeStorage(storageKeys.REDIRECT_URI);
            removeStorage(storageKeys.PROVIDER);
        }
        if (isError) {
            setIsAuthLoading(false);
        }
    }, [isSuccess, isError, data]);

    return { isSuccess, data, isLoading: isAuthLoading || isTokenLoading, isPending, isError };
};

export const useSignOut = (mutationOptions?: UseMutationCustomOptions) => {
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

export const useDeactivate = (mutationOptions?: UseMutationCustomOptions) => {
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

export const useGetProfile = (queryOptions?: UseQueryCustomOptions) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: [queryKeys.GET_PROFILE],
        queryFn: requestProfile,
        gcTime: ONE_DAY_IN_MS,
        staleTime: TEN_TO_A_DAY,
        ...queryOptions,
    });
    return { isError, isLoading, profileData: data as ProfileResponse };
};
