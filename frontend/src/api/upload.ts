import { createClient, httpClient } from '@/api/http';

interface UploadUrlResponse {
    url: string; // Adjust this according to your API response
    key: string;
}

interface UploadResponse {
    url: string; // Adjust this according to your API response
}
export const getUploadUrl = async (type: string): Promise<UploadUrlResponse> => {
    const { data } = await httpClient.get(`/api/upload?type=${type}`);

    return data;
};

const uploadClient = createClient({
    headers: { 'Content-Type': `application/json;charset=UTF-8`, Accept: 'application/json' },
    withCredentials: false,
});

export const uploadImage = async (file: File, url: string): Promise<UploadResponse> => {
    console.log(file.type);
    const { data } = await uploadClient.put(url, file, { headers: { 'Content-Type': file.type } });
    return data;
};
