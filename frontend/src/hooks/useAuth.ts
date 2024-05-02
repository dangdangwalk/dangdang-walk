import { login } from '@/api/auth';

export const useAuth = () => {
    const userLogin = (authorizeCode: string, provider: string, redirectURI: string) => {
        login({ authorizeCode, provider, redirectURI }).then((res) => {
            console.log(res);
        });
    };
    return { userLogin };
};
