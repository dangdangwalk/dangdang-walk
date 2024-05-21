import { Button } from '@/components/common/Button';
import Topbar from '@/components/common/Topbar';
import { ASPECT_RATIO, MIN_DIMENSION } from '@/constants/cropper';
import { useCropStore } from '@/store/cropStore';
import setCanvasPreview from '@/utils/canvas-preview';
import { setStorage } from '@/utils/storage';
import React, { SyntheticEvent, useRef } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';

export default function ImageCropper() {
    const {
        crop,
        setCrop,
        cropperToggle,
        setCropperToggle,
        setDogProfileImgUrl,
        cropPrevImgUrl,
        setCropPrevImgUrl,
        onSelectFileChange,
    } = useCropStore();
    const handleCrop = async () => {
        if (imgRef.current && previewCanvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current?.width, imgRef.current?.height)
            );
            const dataUrl = previewCanvasRef.current.toDataURL();
            // const urlData = await getUploadUrl(['png']);
            setStorage('dataUrl', dataUrl);
            setDogProfileImgUrl(dataUrl);

            setCropperToggle(false);
            setCrop(undefined);
            setCropPrevImgUrl('');
        }
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
            className={`fixed left-0 -bottom-full z-50 flex flex-col justify-center w-full h-full bg-white duration-300 ${cropperToggle ? '-translate-y-full' : 'translate-y-0'}`}
        >
            <Topbar>
                <Topbar.Front className="pl-3 ">
                    <button
                        onClick={() => {
                            setCrop(undefined);
                            setCropperToggle(false);
                        }}
                    >
                        취소
                    </button>
                </Topbar.Front>
                <Topbar.Back>
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
                </Topbar.Back>
            </Topbar>
            {cropPrevImgUrl && (
                <div className="flex flex-col justify-center items-center w-full h-full my-auto">
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
                    className=" fixed"
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
