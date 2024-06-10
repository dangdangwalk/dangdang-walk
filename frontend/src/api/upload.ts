import { createClient, httpClient } from '@/api/http';
import { ImageFileName } from '@/pages/Journals/CreateForm';

interface UploadUrlResponse {
    url: string;
    filename: string;
}

export const getUploadUrl = async (type: string[]): Promise<UploadUrlResponse[]> => {
    const { data } = await httpClient.post(`/images/presigned-url`, type);

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

export const uploadImage = async (file: File, url: string | undefined): Promise<any> => {
    if (!url || !file) return;
    const { data } = await uploadClient.put(url, file, { headers: { 'Content-Type': file.type } });
    return data;
};

export const deleteImages = async (imageFileNames: Array<ImageFileName>) => {
    await httpClient.delete('/images', { data: imageFileNames });
};
