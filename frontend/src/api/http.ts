import queryClient from '@/api/queryClient';
import { queryKeys } from '@/constants';
import { getStorage } from '@/utils/storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const { REACT_APP_NEST_BASE_URL: NEST_BASE_URL = '' } = window._ENV ?? process.env;
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;
const DEFAULT_TIMEOUT = 30000;
export const createClient = (config?: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: NEST_BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            'Content-Type': `application/json;charset=UTF-8`,
            Accept: 'application/json',
        },
        withCredentials: true,
        ...config,
    });

    axiosInstance.interceptors.request.use(
        async (request) => {
            if (request.url?.startsWith(REACT_APP_BASE_IMAGE_URL)) return request;
            if (request.baseURL !== NEST_BASE_URL) return request;

            if (!request.headers['Authorization']) {
                let data = queryClient.getQueryData<{ accessToken: string }>([
                    queryKeys.AUTH,
                    queryKeys.GET_ACCESS_TOKEN,
                ]);

                if (data) {
                    const { accessToken } = data;
                    request.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            }
            return request;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            const isSignedIn = getStorage('isSignedIn') ? true : false;
            if (error.response && error.response.status === 401 && isSignedIn) {
                try {
                    const data = await queryClient.fetchQuery<{ accessToken: string }>({
                        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
                    });

                    if (data) {
                        const originalRequest = error.config;
                        if (originalRequest) {
                            const { accessToken } = data;
                            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                            const response = await axiosInstance(originalRequest);

                            return response;
                        } else {
                            console.error('Original request config is undefined');
                            return Promise.reject(error);
                        }
                    }
                } catch (retryError) {
                    console.error('Retrying request failed:', retryError);
                    return Promise.reject(retryError);
                }
            } else {
                return Promise.reject(error);
            }
        }
    );

    return axiosInstance;
};

export const httpClient = createClient();

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export const requestHandler = async <T>(method: RequestMethod, url: string, data?: T) => {
    let response;

    switch (method) {
        case 'get':
            response = await httpClient.get<T>(url);
            break;
        case 'post':
            response = await httpClient.post<T>(url, data);
            break;
        case 'put':
            response = await httpClient.put<T>(url, data);
            break;
        case 'delete':
            response = await httpClient.delete<T>(url);
            break;
        default:
            throw new Error('Invalid request method');
    }
    return response.data;
};
