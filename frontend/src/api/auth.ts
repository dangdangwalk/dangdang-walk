import { httpClient } from './http';

export type ResponseToken = {
    accessToken: string;
};

const getAccessToken = async (): Promise<ResponseToken> => {
    const { data } = await httpClient.get('/auth/token');
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
const requestProfile = async (): Promise<ResponseProfile> => {
    const { data } = await httpClient.get('/users/me');
    return data;
};
export { getAccessToken, requestLogin, requestLogout, requestSignup, requestDeactivate, requestProfile };
