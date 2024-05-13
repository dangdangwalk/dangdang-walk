import { ResponseToken, getAccessToken, requestLogin, requestLogout, requestSignup } from '@/api/auth';
import queryClient from '@/api/queryClient';
import { cookieKeys, queryKeys, storageKeys, tokenKeys } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { UseMutationCustomOptions } from '@/types/common';
import { getCookie } from '@/utils/cookie';
import { removeHeader } from '@/utils/header';
import { getStorage } from '@/utils/storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = (mutationOptions?: UseMutationCustomOptions) => {
    const { storeLogin } = useAuthStore();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: requestLogin,
        onSuccess: ({ accessToken }: ResponseToken) => {
            const url = getStorage(storageKeys.REDIRECT_URI) || '';
            console.log(accessToken);

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
        },
        ...mutationOptions,
    });
};

const useSignup = (mutationOptions?: UseMutationCustomOptions) => {
    const { storeLogin } = useAuthStore();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: requestSignup,
        onSuccess: ({ accessToken }: ResponseToken) => {
            const url = getStorage(storageKeys.REDIRECT_URI) || '';
            storeLogin(accessToken);
            navigate(url);
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN] });
        },
        ...mutationOptions,
    });
};

const useGetRefreshToken = () => {
    const { storeLogin } = useAuthStore();
    const expiresIn = getCookie(cookieKeys.EXPIRES_IN);
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
            storeLogin(data.accessToken);
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
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.AUTH] });
            storeLogout();
        },
        ...mutationOptions,
    });
};

export const useAuth = () => {
    const { isStoreLogin } = useAuthStore();
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const signupMustation = useSignup();
    const isLoggedIn = isStoreLogin;
    useGetRefreshToken();
    return { loginMutation, isLoggedIn, logoutMutation, signupMustation };
};
