import {
    ResponseProfile,
    ResponseToken,
    getAccessToken,
    requestDeactivate,
    requestLogin,
    requestLogout,
    requestProfile,
    requestSignup,
} from '@/api/auth';
import queryClient from '@/api/queryClient';
import { queryKeys, storageKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';
import { getStorage, removeStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    const { storeLogin } = useAuthStore();
    return useMutation({
        mutationFn: requestLogin,
        onSuccess: ({ accessToken }: ResponseToken) => {
            const url = getStorage(storageKeys.REDIRECT_URI) || '';
            storeLogin(accessToken);
            navigate(url);
        },
        onError: (error) => {
            if (error.response && error.response.status === 404) {
                navigate('/join');
            }
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE] });
        },
        ...mutationOptions,
    });
};

const useSignup = (mutationOptions?: UseMutationCustomOptions) => {
    const { storeLogin } = useAuthStore();
    return useMutation({
        mutationFn: requestSignup,
        onSuccess: ({ accessToken }: ResponseToken) => {
            storeLogin(accessToken);
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN] });
        },
        ...mutationOptions,
    });
};

const useGetRefreshToken = () => {
    const { storeLogin, storeLogout } = useAuthStore();
    const { isSuccess, isError, data } = useQuery({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
        queryFn: getAccessToken,
        gcTime: 1000 * 60 * 60 + 1000 * 60,
        staleTime: 1000 * 60 * 60 - 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 60 - 1000 * 60 * 10,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
    });
    useEffect(() => {
        if (isSuccess) {
            storeLogin(data.accessToken);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isError) {
            storeLogout();
        }
    }, [isError]);
    return { isSuccess, isError };
};

const useLogout = (mutationOptions?: UseMutationCustomOptions) => {
    const { storeLogout } = useAuthStore();
    return useMutation({
        mutationFn: requestLogout,
        onSuccess: () => {
            storeLogout();
            removeStorage(storageKeys.REDIRECT_URI);
            removeStorage(storageKeys.PROVIDER);
            queryClient.resetQueries({ queryKey: [queryKeys.AUTH] });
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
        },
        ...mutationOptions,
    });
};

const useDeactivate = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    const { storeLogout } = useAuthStore();
    return useMutation({
        mutationFn: requestDeactivate,
        onSuccess: () => {
            storeLogout();
            queryClient.resetQueries({ queryKey: [queryKeys.AUTH] });
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
            navigate('/');
        },
        ...mutationOptions,
    });
};

const useGetProfile = (queryOptions?: UseQueryCustomOptions) => {
    return useQuery({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
        queryFn: requestProfile,
        ...queryOptions,
    });
};
export const useAuth = () => {
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const signupMustation = useSignup();
    const refreshTokenQuery = useGetRefreshToken();
    const getProfileQuery = useGetProfile();
    const deactivateMutation = useDeactivate();
    return {
        isTokenInit: refreshTokenQuery.isSuccess,
        loginMutation,
        logoutMutation,
        signupMustation,
        refreshTokenQuery,
        deactivateMutation,
        profileData: getProfileQuery.data as ResponseProfile,
    };
};
