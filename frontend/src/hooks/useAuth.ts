import { login } from '@/api/auth';

export const useAuth = () => {
    const userLogin = (authorizeCode: string, provider: string) => {
        login({ authorizeCode, provider }).then((res) => {
            console.log(res);
        });
    };
    return { userLogin };
};
