import { Button } from '@/components/common/Button';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from './Modal';

const meta = {
    component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

function ModalUsageExample() {
    const [open, setOpen] = useState(false);

    return (
        <Modal open={open}>
            <ModalTrigger>
                <Button onClick={() => setOpen(true)}>산책기록 삭제하기</Button>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>산책기록삭제</ModalTitle>
                    <ModalDescription>오늘한 산책을 기록에서 삭제할까요?</ModalDescription>
                </ModalHeader>
                <ModalFooter>
                    <ModalCancel onClick={() => setOpen(false)}>취소</ModalCancel>
                    <ModalAction onClick={() => setOpen(false)}>삭제하기</ModalAction>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export const UsageExample = {
    name: '사용 예시',
    render: () => <ModalUsageExample />,
} satisfies Story;
