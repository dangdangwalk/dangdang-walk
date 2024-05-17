import useImageUpload from '@/hooks/useImageUpload';
import html2canvas from 'html2canvas';
const { REACT_APP_BASE_IMAGE_URL = '' } = window._ENV ?? process.env;
declare global {
    interface Window {
        kakao: any;
    }
}
export default function Camera() {
    const { selectedFiles, uploadedImageUrls, handleFileChange, handleUpload } = useImageUpload();

    const saveAsImageHandler = async () => {
        const target = document.getElementById('map');
        if (!target) {
            return alert('결과 저장에 실패했습니다.');
        }
        html2canvas(target, {
            useCORS: true,
            proxy: '/html2canvas-proxy',
        }).then((canvas) => {
            document.body.appendChild(canvas);
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = canvas.toDataURL('image/png');
            link.download = 'result.png';
            console.log(canvas);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <>
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
            <button onClick={saveAsImageHandler}>클릭</button>
        </>
    );
}
