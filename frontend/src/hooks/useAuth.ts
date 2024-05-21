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
import { queryKeys, storageKeys, tokenKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';
import { removeHeader, setHeader } from '@/utils/header';
import { getStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: requestLogin,
        onSuccess: ({ accessToken }: ResponseToken) => {
            const url = getStorage(storageKeys.REDIRECT_URI) || '';

            setHeader(tokenKeys.AUTHORIZATION, `Bearer ${accessToken}`);
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
    return useMutation({
        mutationFn: requestSignup,
        onSuccess: ({ accessToken }: ResponseToken) => {
            setHeader(tokenKeys.AUTHORIZATION, `Bearer ${accessToken}`);
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN] });
        },
        ...mutationOptions,
    });
};

const useGetRefreshToken = () => {
    const { expiresIn } = useAuthStore();

    const { isSuccess, isError, data } = useQuery({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
        queryFn: getAccessToken,
        gcTime: expiresIn + 1000 * 60,
        staleTime: expiresIn - 1000 * 60 * 10,
        refetchInterval: expiresIn - 1000 * 60 * 10,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
    });
    useEffect(() => {
        if (isSuccess) {
            setHeader(tokenKeys.AUTHORIZATION, `Bearer ${data.accessToken}`);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isError) {
            removeHeader(tokenKeys.AUTHORIZATION);
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
            queryClient.resetQueries({ queryKey: [queryKeys.AUTH] });
            queryClient.refetchQueries({ queryKey: [queryKeys.DOGS] });
        },
        ...mutationOptions,
    });
};

const useDeactivate = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: requestDeactivate,
        onSuccess: () => {
            removeHeader(tokenKeys.AUTHORIZATION);
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
    const getProfileQuery = useGetProfile({
        enabled: refreshTokenQuery.isSuccess,
    });
    const deactivateMutation = useDeactivate();
    return {
        loginMutation,
        isLoggedIn: getProfileQuery.isSuccess,
        logoutMutation,
        signupMustation,
        refreshTokenQuery,
        deactivateMutation,
        profileData: getProfileQuery.data as ResponseProfile,
    };
};
