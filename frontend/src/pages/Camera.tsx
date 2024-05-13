import { useRef, useState } from 'react';

export default function Camera() {
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        console.log('Starting camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log(stream);
            console.log(videoRef);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        console.log('Stopping camera');
        if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            console.log('takePicture');

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // You can now access the image data from the canvas and save it or process it further
            }
        }
    };
    return (
        <div>
            <button onClick={startCamera} disabled={isStreaming}>
                Start Camera
            </button>
            <button onClick={stopCamera} disabled={!isStreaming}>
                Stop Camera
            </button>
            <button onClick={takePicture} disabled={!isStreaming}>
                Take Picture
            </button>
            <video ref={videoRef} autoPlay playsInline />
            <input type="file" id="camera" name="camera" capture="environment" accept="image/*" />
            <div>
                {/* {isStreaming && <video ref={videoRef} autoPlay playsInline />} */}
                <canvas ref={canvasRef} style={{ display: 'block', width: '100vw' }} />
            </div>
        </div>
    );
}
