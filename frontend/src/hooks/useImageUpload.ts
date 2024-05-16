import { getUploadUrl, uploadImage } from '@/api/upload';
import { ChangeEvent, useState } from 'react';

const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;

const useImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[] | null>([]);

    // const mutation = useMutation({
    //     mutationFn: async (file, url) => {
    //         await uploadImage(file, url);
    //     },
    //     onSuccess: (data) => {
    //         console.log(data);
    //         // setUploadedImageUrl(uploadedImageUrl ? [...uploadedImageUrl, data] : [data]);
    //     },
    //     onError: (error) => {
    //         console.error('Upload failed:', error);
    //     },
    // });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    const handleUpload = () => {
        if (selectedFile) {
            // mutation.mutate(selectedFile);
            getUploadUrl(selectedFile.type).then((data) => {
                // mutation.mutate(selectedFile, data.url);
                uploadImage(selectedFile, data.url).then(() => {
                    setUploadedImageUrls(
                        uploadedImageUrls
                            ? [...uploadedImageUrls, `${REACT_APP_BASE_IMAGE_URL}/${data.key}`]
                            : [`${REACT_APP_BASE_IMAGE_URL}/${data.key}`]
                    );
                });
                // setSelectedFile(null);
            });
        }
    };

    return { selectedFile, uploadedImageUrls, handleFileChange, handleUpload };
};

export default useImageUpload;
