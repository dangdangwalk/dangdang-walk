import { LoginParams, requestLogin, requestLogout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const { storeLogin, storeLogout } = useAuthStore();
    const navigate = useNavigate();
    const userLogin = (data: LoginParams) => {
        requestLogin(data).then((res) => {
            storeLogin(`Bearer ${res.accessToken}`);
            navigate(data.redirectURI);
        });
    };
    const useLogout = () => {
        requestLogout();
        storeLogout();
    };
    return { userLogin, useLogout };
};

// // export function useLogin(mutationOptions?: UseMutationCustomOptions) {
// //     const { storeLogin } = useAuthStore();
// //     const loginMutation = useMutation({
// //         mutationFn: requestLogin,
// //         onSuccess: ({ accessToken }) => {
// //             console.log('3');

// //             console.log(accessToken);

// //             storeLogin(accessToken);
// //         },
// //         onSettled: () => {},
// //         ...mutationOptions,
// //     });
// //     return { login: loginMutation.mutateAsync };
// // }

// const useAuth = () => {
//     const login = useLogin();
//     return { login };
// };

// export default useAuth;
