import { Button } from '@/components/commons/Button';
import TopBar from '@/components/commons/Topbar';
import { storageKeys } from '@/constants';
import { ASPECT_RATIO, MIN_DIMENSION } from '@/constants/cropper';
import { useStore } from '@/store';
import setCanvasPreview from '@/utils/canvasPreview';
import { setStorage } from '@/utils/storage';
import { SyntheticEvent, useRef } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';

export default function ImageCropper() {
    const crop = useStore((state) => state.crop);
    const setCrop = useStore((state) => state.setCrop);
    const cropperToggle = useStore((state) => state.cropperToggle);
    const setCropperToggle = useStore((state) => state.setCropperToggle);
    const setDogProfileImgUrl = useStore((state) => state.setDogProfileImgUrl);
    const cropPrevImgUrl = useStore((state) => state.cropPrevImgUrl);
    const setCropPrevImgUrl = useStore((state) => state.setCropPrevImgUrl);
    const onSelectFileChange = useStore((state) => state.onSelectFileChange);
    const spinnerAdd = useStore((state) => state.spinnerAdd);
    const spinnerRemove = useStore((state) => state.spinnerRemove);
    const handleCrop = async () => {
        spinnerAdd();
        if (imgRef.current && previewCanvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current?.width, imgRef.current?.height)
            );
            const dataUrl = previewCanvasRef.current.toDataURL('image/jpeg', 0.1);
            setStorage(storageKeys.DATA_URL, dataUrl);
            setDogProfileImgUrl(dataUrl);

            setCropperToggle(false);
            setCrop(undefined);
            setCropPrevImgUrl('');
        }
        spinnerRemove();
    };

    const onImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const newCrop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(newCrop, width, height);
        setCrop(centeredCrop);
    };
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    return (
        <div
            className={`fixed -bottom-full z-50 flex size-full max-w-screen-sm flex-col justify-center bg-white duration-300 ${cropperToggle ? '-translate-y-full' : 'translate-y-0'}`}
        >
            <TopBar>
                <TopBar.Front className="pl-3">
                    <button
                        onClick={() => {
                            setCrop(undefined);
                            setCropperToggle(false);
                        }}
                    >
                        취소
                    </button>
                </TopBar.Front>
                <TopBar.Back>
                    <label
                        htmlFor="input-upload"
                        className="cursor-pointer"
                        onClick={() => {
                            setCrop(undefined);
                        }}
                    >
                        <input
                            className="hidden"
                            name="input"
                            id="input-upload"
                            type="file"
                            accept="image/*"
                            onChange={onSelectFileChange}
                        />
                        사진
                    </label>
                </TopBar.Back>
            </TopBar>
            {cropPrevImgUrl && (
                <div className="my-auto flex size-full flex-col items-center justify-center">
                    <ReactCrop
                        className="flex flex-col"
                        crop={crop}
                        circularCrop
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                        onChange={(pixelCrop, percentCrop) => {
                            setCrop(percentCrop);
                        }}
                    >
                        <img
                            ref={imgRef}
                            src={cropPrevImgUrl}
                            alt="Upload"
                            style={{ height: '100%', maxHeight: '75vh' }}
                            onLoad={(event) => onImageLoad(event)}
                        />
                    </ReactCrop>
                </div>
            )}
            {crop && (
                <canvas
                    ref={previewCanvasRef}
                    className="fixed"
                    style={{
                        display: 'none',
                        border: '1px solid black',
                        objectFit: 'contain',
                        width: 120,
                        height: 120,
                    }}
                />
            )}
            <div>
                <Button className="w-full" color="primary" rounded="none" onClick={handleCrop}>
                    적용하기
                </Button>
            </div>
        </div>
    );
}
