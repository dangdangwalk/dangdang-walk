import useImageUpload from '@/hooks/useImageUpload';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;
export default function Camera() {
    const { selectedFiles, uploadedImageUrls, handleFileChange, handleUpload } = useImageUpload();

    return (
        <div>
            <input
                type="file"
                id="camera"
                name="camera"
                capture="environment"
                accept="image/*"
                onChange={handleFileChange}
            />
            {selectedFiles &&
                selectedFiles.map((file: File) => {
                    return file.name;
                })}
            <button onClick={handleUpload}>
                {/* {mutation.isPending ? 'Uploading...' : 'Upload'} */}
                upload
            </button>
            {/* <button onClick={handleUpload} disabled={mutation.isPending}>
                {mutation.isPending ? 'Uploading...' : 'Upload'}
            </button> */}
            {uploadedImageUrls && (
                <div>
                    <p>Uploaded Image:</p>
                    {uploadedImageUrls.map((url) => (
                        <img key={url} src={`${REACT_APP_BASE_IMAGE_URL}/${url}`} alt="Uploaded" />
                    ))}
                </div>
            )}
        </div>
    );
}
