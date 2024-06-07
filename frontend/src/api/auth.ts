import { httpClient } from './http';

export interface SignInResponse {
    accessToken: string;
}

const refreshAccessToken = async (): Promise<SignInResponse> => {
    const { data } = await httpClient.get<SignInResponse>('/auth/token');
    return data;
};

const requestSignIn = async ({ authorizeCode, provider }: { authorizeCode: string; provider: string }) => {
    const { data } = await httpClient.post<SignInResponse>('/auth/login', { authorizeCode, provider });
    return data;
};

const requestSignOut = async () => {
    await httpClient.post('/auth/logout');
};

const requestSignUp = async () => {
    const { data } = await httpClient.post<SignInResponse>('/auth/signup');
    return data;
};

const requestDeactivate = async () => {
    await httpClient.delete('/auth/deactivate');
};

export type ProfileResponse = {
    nickname: string;
    email: string;
    profileImage: string;
    provider: string;
};
const requestProfile = async (): Promise<ProfileResponse> => {
    const { data } = await httpClient.get<ProfileResponse>('/users/me');
    return data;
};
export { refreshAccessToken, requestSignIn, requestSignOut, requestSignUp, requestDeactivate, requestProfile };
