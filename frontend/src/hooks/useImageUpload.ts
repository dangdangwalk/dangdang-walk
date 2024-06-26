import { getUploadUrl, uploadImage } from '@/api/upload';
import useToast from '@/hooks/useToast';
import { ChangeEvent, useEffect, useState } from 'react';

//TODO: react-query 적용
const useImageUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const { show: showToast } = useToast();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles && selectedFiles[0]) {
            const data = await getUploadUrl(selectedFiles.map((file) => file.type));
            const result = await Promise.allSettled(
                selectedFiles.map((file, index) => {
                    return uploadImage(file, data[index]?.url);
                })
            );
            const newImages: string[] = [];
            result.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const filename = data[index]?.filename;
                    if (filename) {
                        newImages.push(filename);
                    }
                }
            });
            setUploadedImageUrls(uploadedImageUrls ? [...uploadedImageUrls, ...newImages] : [...newImages]);
            setSelectedFiles([]);
            showToast('사진이 저장되었습니다 :)');
        }
    };
    useEffect(() => {
        handleUpload();
    }, [selectedFiles]);

    return { selectedFiles, handleUpload, uploadedImageUrls, handleFileChange, setUploadedImageUrls };
};

export default useImageUpload;
