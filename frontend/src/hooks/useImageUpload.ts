import { getUploadUrl, uploadImage } from '@/api/upload';
import { ChangeEvent, useEffect, useState } from 'react';

const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

//TODO: react-query 적용 and 멀티 이미지 업로드
const useImageUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[] | null>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles && selectedFiles[0]) {
            const data = await getUploadUrl(selectedFiles[0].type);
            await uploadImage(selectedFiles[0], data.url);
            setUploadedImageUrls(
                uploadedImageUrls
                    ? [...uploadedImageUrls, `${REACT_APP_BASE_IMAGE_URL}/${data.filename}`]
                    : [`${REACT_APP_BASE_IMAGE_URL}/${data.filename}`]
            );
            setSelectedFiles([]);
        }
    };
    useEffect(() => {
        handleUpload();
    }, [selectedFiles]);

    return { selectedFiles, uploadedImageUrls, handleFileChange, handleUpload };
};

export default useImageUpload;
