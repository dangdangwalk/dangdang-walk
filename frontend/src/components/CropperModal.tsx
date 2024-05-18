import {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/common/Modal';
import { MIN_DIMENSION } from '@/constants/cropper';
import { useCropStore } from '@/store/cropStore';
import React, { MutableRefObject } from 'react';

interface Props {
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
}
export default function CropperModal({ fileInputRef }: Props) {
    const { setCrop, setCropError } = useCropStore();
    const handleChange = () => {
        fileInputRef.current?.click();
        setCropError(false);
    };
    return (
        <div className="fixed">
            <Modal open={true}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>이미지가 너무 작아요</ModalTitle>
                        <ModalDescription>
                            {MIN_DIMENSION} X {MIN_DIMENSION}픽셀 이상의 이미지를 사용해주세요.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <ModalCancel
                            onClick={() => {
                                setCropError(false);
                                setCrop(undefined);
                            }}
                        >
                            닫기
                        </ModalCancel>
                        <ModalAction onClick={handleChange}>다시 고르기</ModalAction>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
