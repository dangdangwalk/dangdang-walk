import { httpClient } from './http';

export type ResponseToken = {
    accessToken: string;
    expiresIn: number;
};

const getAccessToken = async (): Promise<ResponseToken> => {
    const { data } = await httpClient.get('/auth/token');
    return data;
};

export interface LoginParams {
    authorizeCode: string;
    provider: string;
    redirectURI: string;
}
const requestLogin = async (params: LoginParams) => {
    const { data } = await httpClient.post('/auth/login', params);
    return data;
};

const requestLogout = async () => {
    await httpClient.post('/auth/logout');
};

const requestSignin = async (params: LoginParams) => {
    const { data } = await httpClient.post('/auth/signup', params);
    return data;
};
export { getAccessToken, requestLogin, requestLogout, requestSignin };
