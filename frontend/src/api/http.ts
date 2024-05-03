import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const { REACT_APP_NEST_BASE_URL } = process.env;
const DEFAULT_TIMEOUT = 30000;

console.log(REACT_APP_NEST_BASE_URL);
export const createClient = (config?: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: REACT_APP_NEST_BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            'Content-Type': `application/json;charset=UTF-8`,
            Accept: 'application/json',
        },
        withCredentials: true,
        ...config,
    });
    axiosInstance.interceptors.request.use(
        (request) => {
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
        (error) => {
            return Promise.reject(error);
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
