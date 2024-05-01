import { getCookie } from '@/utils/cookie';
import { httpClient } from './http';

type ResponseToken = {
    accessToken: string;
    refreshToken: string;
};

const getAccessToken = async (): Promise<ResponseToken> => {
    const refreshToken = getCookie('refreshToken');
    const { data } = await httpClient.get('/login', {
        // headers: {
        //     Authorization: `Bearer ${refreshToken}`,
        // },
    });
    return data;
};

interface LoginParams {
    authorizeCode: string;
    provider: string;
}
const login = async (params: LoginParams) => {
    const { data } = await httpClient.post('/auth/login', params);
    return data;
};
export { getAccessToken, login };
