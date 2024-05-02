import { httpClient } from './http';

type ResponseToken = {
    accessToken: string;
    refreshToken: string;
};

const getAccessToken = async (): Promise<ResponseToken> => {
    const { data } = await httpClient.get('/auth/token');
    return data;
};

interface LoginParams {
    authorizeCode: string;
    provider: string;
    redirectURI: string;
}
const login = async (params: LoginParams) => {
    const { data } = await httpClient.post('/auth/login', params);
    return data;
};
export { getAccessToken, login };
