import useImageUpload from '@/hooks/useImageUpload';

export default function Camera() {
    const { selectedFile, uploadedImageUrls, handleFileChange, handleUpload } = useImageUpload();

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
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
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
                        <img key={url} src={url} alt="Uploaded" />
                    ))}
                </div>
            )}
        </div>
    );
}
