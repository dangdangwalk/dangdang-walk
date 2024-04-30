import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
// import { getToken, removeToken } from '../store/authStore';

const BASE_URL = process.env.BASE_URL;
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            'Content-Type': `application/json;charset=UTF-8`,
            Accept: 'application/json',
            // Authorization: getToken() ? `Bearer ${getToken()}` : '',
        },
        withCredentials: true,
        ...config,
    });

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                // removeToken();
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

const httpClient = createClient();

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
