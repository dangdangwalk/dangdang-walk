import { getUploadUrl, uploadImage } from '@/api/upload';
import { ChangeEvent, useState } from 'react';

const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

//TODO: react-query 적용 and 멀티 이미지 업로드
const useImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[] | null>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    const handleUpload = async () => {
        if (selectedFile) {
            const data = await getUploadUrl(selectedFile.type);
            await uploadImage(selectedFile, data.url);
            setUploadedImageUrls(
                uploadedImageUrls
                    ? [...uploadedImageUrls, `${REACT_APP_BASE_IMAGE_URL}/${data.filename}`]
                    : [`${REACT_APP_BASE_IMAGE_URL}/${data.filename}`]
            );
            setSelectedFile(null);
        }
    };

    return { selectedFile, uploadedImageUrls, handleFileChange, handleUpload };
};

export default useImageUpload;
