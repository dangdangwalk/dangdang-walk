import { Button } from '@/components/common/Button';
import Topbar from '@/components/common/Topbar';
import { ASPECT_RATIO, MIN_DIMENSION } from '@/constants/cropper';
import { DogRegInfo } from '@/pages/Join';
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
    setRegisterData: Dispatch<SetStateAction<DogRegInfo>>;
    onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void;
    setDogImgUrl: (url: string) => void;
    setDogPhotoFile: (file: File) => void;
}

export default function ImageCropper({
    prevImg,
    setPrevImg,
    cropperToggle,
    setCropperToggle,
    onSelectFile,
    crop,
    setCrop,
    setDogImgUrl,
    setDogPhotoFile,
}: Props) {
    const dataURLtoFile = (dataurl: string, fileName: string): File | null => {
        // 데이터 URL 문자열 분리
        const arr = dataurl.split(',');

        if (!arr || !arr[0] || !arr[1]) {
            console.error('Invalid data URL format');
            return null; // 또는 다른 에러 처리 로직
        }

        // MIME 타입 추출
        const mime = arr[0].match(/:(.*?);/)![1];
        // Base64 디코딩 전에 arr[1]이 undefined인지 확인
        if (!arr[1]) {
            console.error('Base64 data is missing');
            return null; // 또는 다른 에러 처리 로직
        }
        // Base64 디코딩
        let bstr = atob(arr[1]);
        const n = bstr.length;
        // Uint8Array 생성 및 채우기
        const u8arr = new Uint8Array(n);

        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }

        // File 객체 반환
        return new File([u8arr.buffer], fileName, { type: mime });
    };

    const handleCrop = () => {
        if (imgRef.current && previewCanvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current?.width, imgRef.current?.height)
            );
            const dataUrl = previewCanvasRef.current.toDataURL();
            const date = new Date();
            const fileName = date.valueOf();
            const file = dataURLtoFile(dataUrl, fileName.toString());
            console.log(file);
            if (file !== null) setDogPhotoFile(file);

            setDogImgUrl(dataUrl);

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
