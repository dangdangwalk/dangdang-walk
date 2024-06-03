import { httpClient } from './http';
import { getStorage } from '@/utils/storage';
import { storageKeys } from '@/constants';

export type ResponseToken = {
    accessToken: string;
};

const getAccessToken = async (): Promise<ResponseToken | undefined> => {
    const isLoggedIn = getStorage(storageKeys.IS_LOGGED_IN) ? true : false;
    let data: ResponseToken | undefined;

    if (isLoggedIn) {
        const response = await httpClient.get('/auth/token');
        data = response.data;
    }

    return data;
};

export interface LoginParams {
    authorizeCode: string;
    provider: string;
}
const requestLogin = async (params: LoginParams) => {
    const { data } = await httpClient.post('/auth/login', params);
    return data;
};

const requestLogout = async () => {
    await httpClient.post('/auth/logout');
};

const requestSignup = async () => {
    const { data } = await httpClient.post('/auth/signup');
    return data;
};

const requestDeactivate = async () => {
    await httpClient.delete('/auth/deactivate');
};

export type ResponseProfile = {
    nickname: string;
    email: string;
    profileImage: string;
    provider: string;
};
const requestProfile = async (): Promise<ResponseProfile | undefined> => {
    const isLoggedIn = getStorage(storageKeys.IS_LOGGED_IN) ? true : false;
    let data: ResponseProfile | undefined;
    if (isLoggedIn) {
        const response = await httpClient.get('/users/me');
        data = response.data;
    }
    return data;
};
export { getAccessToken, requestLogin, requestLogout, requestSignup, requestDeactivate, requestProfile };
