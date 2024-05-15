import { Button } from '@/components/common/Button';
import Topbar from '@/components/common/Topbar';
import { ASPECT_RATIO, MIN_DIMENSION } from '@/constants/cropper';
import { DogRefInfo } from '@/pages/Join';
import setCanvasPreview from '@/utils/canvas-preview';
import React, { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useRef } from 'react';
import ReactCrop, { PercentCrop, centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';

interface Props {
    prevImg: string;
    setPrevImg: (url: string) => void;
    crop: PercentCrop | undefined;
    setCrop: Dispatch<SetStateAction<PercentCrop | undefined>>;
    cropperToggle: boolean;
    setCropperToggle: (state: boolean) => void;
    setRegisterData: Dispatch<SetStateAction<DogRefInfo>>;
    onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageCropper({
    prevImg,
    setPrevImg,
    cropperToggle,
    setCropperToggle,
    setRegisterData,
    onSelectFile,
    crop,
    setCrop,
}: Props) {
    const handleCrop = () => {
        if (imgRef.current && previewCanvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current?.width, imgRef.current?.height)
            );
            const dataUrl = previewCanvasRef.current.toDataURL();
            setRegisterData((prev) => ({
                ...prev,
                dogBasicInfo: {
                    ...prev.dogBasicInfo,
                    profilePhotoUrl: dataUrl,
                },
            }));
            console.log(dataUrl);

            setCropperToggle(false);
            setCrop(undefined);
            setPrevImg('');
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
            className={`fixed -bottom-full flex flex-col justify-center w-full h-full bg-white duration-300 ${cropperToggle ? '-translate-y-full' : 'translate-y-0'}`}
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
                            onChange={onSelectFile}
                        />
                        사진
                    </label>
                </Topbar.Back>
            </Topbar>
            {prevImg && (
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
                            src={prevImg}
                            alt="Upload"
                            style={{ height: '100%', maxHeight: '86vh' }}
                            onLoad={(event) => onImageLoad(event)}
                            className="w-full h-full"
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
