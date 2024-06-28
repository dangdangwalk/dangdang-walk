import { getUploadUrl, uploadImage } from '@/api/upload';

export const uploadImages = async (files: FileList): Promise<string[]> => {
    const fileTypes = Array.from(files).map((file) => file.type);
    const uploadUrlResponses = await getUploadUrl(fileTypes);
    const uploadUrls = uploadUrlResponses.map((uploadUrlResponse) => uploadUrlResponse.url);

    const uploadImagePromises = uploadUrls.map((uploadUrl, index) => {
        return uploadImage(files[index]!, uploadUrl);
    });
    await Promise.allSettled(uploadImagePromises);

    const filenames = uploadUrlResponses.map((uploadUrlResponse) => uploadUrlResponse.filename);
    return filenames;
};
