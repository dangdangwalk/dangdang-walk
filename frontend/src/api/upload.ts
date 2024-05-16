import { createClient, httpClient } from '@/api/http';

interface UploadUrlResponse {
    url: string; // Adjust this according to your API response
    filename: string;
}

export const getUploadUrl = async (type: string): Promise<UploadUrlResponse> => {
    const { data } = await httpClient.get(`/api/upload?type=${type}`);

    return data;
};

const uploadClient = createClient({
    headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, GET',
    },
    withCredentials: false,
});

export const uploadImage = async (file: File, url: string): Promise<any | undefined> => {
    const { data } = await uploadClient.put(url, file, { headers: { 'Content-Type': file.type } });
    return data;
};
