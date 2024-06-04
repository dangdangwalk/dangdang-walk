import {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '@/components/commons/Modal';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CancelRegModal({ setCancelReg }: { setCancelReg: (state: boolean) => void }) {
    const navigate = useNavigate();
    return (
        <div className="fixed">
            <Modal open={true}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>반려견 정보 삭제</ModalTitle>
                        <ModalDescription>지금까지 입력한 정보를 삭제를 삭제할까요?</ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <ModalCancel onClick={() => setCancelReg(false)}>취소</ModalCancel>
                        <ModalAction onClick={() => navigate('/')}>삭제하기</ModalAction>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
