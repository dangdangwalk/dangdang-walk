import { ResponseToken, getAccessToken, requestLogin, requestLogout, requestSignin } from '@/api/auth';
import queryClient from '@/api/queryClient';
import { tokenKeys } from '@/constants';
import { UseMutationCustomOptions } from '@/types/common';
import { removeHeader, setHeader } from '@/utils/header';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = (mutationOptions?: UseMutationCustomOptions) => {
    const navigate = useNavigate();
    const isJoinning = getStorage('isJoinning');
    const fn = isJoinning ? requestSignin : requestLogin;
    removeStorage('isJoinning');
    return useMutation({
        mutationFn: fn,
        onSuccess: ({ accessToken, expiresIn }: ResponseToken) => {
            const url = getStorage('redirect') || '';
            setHeader(tokenKeys.AUTHORIZATION, `Bearer ${accessToken}`);
            setStorage(tokenKeys.AUTHORIZATION, accessToken);
            navigate(url);
        },
        onError: (error) => {
            if (error.response && error.response.status === 404) {
                navigate('/join');
            }
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['auth', 'getAccessToken'] });
        },
        ...mutationOptions,
    });
};

const useGetRefreshToken = () => {
    const { isSuccess, isError, data } = useQuery({
        queryKey: ['auth', 'getAccessToken'],
        queryFn: getAccessToken,
        staleTime: 1000 * 60 * 60 * 12 - 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 60 * 12 - 1000 * 60 * 10,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
    });
    useEffect(() => {
        if (isSuccess) {
            setHeader(tokenKeys.AUTHORIZATION, `Bearer ${data.accessToken}`);
            setStorage(tokenKeys.AUTHORIZATION, data.accessToken);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isError) {
            removeHeader(tokenKeys.AUTHORIZATION);
            removeStorage(tokenKeys.AUTHORIZATION);
        }
    }, [isError]);
    return { isSuccess, isError };
};

const useLogout = (mutationOptions?: UseMutationCustomOptions) => {
    return useMutation({
        mutationFn: requestLogout,
        onSuccess: () => {
            removeHeader(tokenKeys.AUTHORIZATION);
            removeStorage(tokenKeys.AUTHORIZATION);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            removeHeader(tokenKeys.AUTHORIZATION);
            removeStorage(tokenKeys.AUTHORIZATION);
        },
        ...mutationOptions,
    });
};

export const useAuth = () => {
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    useGetRefreshToken();
    const isLoggedIn = getStorage(tokenKeys.AUTHORIZATION) ? true : false;
    return { loginMutation, isLoggedIn, logoutMutation };
};
