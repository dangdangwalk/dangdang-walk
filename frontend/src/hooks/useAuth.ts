import {
    ProfileResponse,
    SignInResponse,
    refreshAccessToken,
    requestDeactivate,
    requestSignIn,
    requestSignOut,
    requestProfile,
    requestSignUp,
} from '@/api/auth';
import queryClient from '@/api/queryClient';
import { ONE_DAY_IN_MS, FIFTY_MIN, ONE_HOUR, TEN_TO_A_DAY, queryKeys, storageKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';
import { getStorage, removeStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSignIn = (mutationOptions?: UseMutationCustomOptions) => {
    const { storeSignIn } = useAuthStore();
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
    const { storeSignIn } = useAuthStore();
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
    const { storeSignIn } = useAuthStore();
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
    const { storeSignOut } = useAuthStore();
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
    const { storeSignOut } = useAuthStore();
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
    const { isSignedIn } = useAuthStore();
    return useQuery({
        queryKey: [queryKeys.GET_PROFILE],
        queryFn: requestProfile,
        gcTime: ONE_DAY_IN_MS,
        staleTime: TEN_TO_A_DAY,
        enabled: isSignedIn,
        ...queryOptions,
    });
};
export const useAuth = () => {
    const signIn = useSignIn();
    const signOut = useSignOut();
    const signUp = useSignUp();
    const refreshTokenQuery = useGetRefreshToken();
    const getProfileQuery = useGetProfile();
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
