import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/common/Button';
import useToast from '@/hooks/useToast';
import { Toast } from './Toast';

const meta = {
    component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastWithHooks() {
    const { show } = useToast();

    return (
        <div className="h-52">
            <Toast />
            <Button onClick={() => show('산책 기록이 저장되었습니다.')}>저장하기</Button>
        </div>
    );
}

export const UsageExample = {
    name: '사용 예시',
    render: () => <ToastWithHooks />,
} satisfies Story;
