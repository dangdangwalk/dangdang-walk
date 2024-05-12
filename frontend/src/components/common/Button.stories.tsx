/* eslint-disable jsx-a11y/anchor-is-valid */
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        color: {
            type: { name: 'enum', value: ['primary', 'secondary'] },
            table: {
                defaultValue: { summary: 'primary' },
            },
        },
        rounded: {
            type: { name: 'enum', value: ['none', 'small', 'medium', 'full'] },
            table: {
                defaultValue: { summary: 'medium' },
            },
        },
        asChild: {
            type: { name: 'boolean' },
            table: {
                defaultValue: { summary: 'false' },
            },
            description: '`boolean` 타입으로 `true`이면 자신의 모든 것이 자식 요소에 병합된다.',
            control: {
                disable: true,
            },
        },
        className: {
            table: {
                disable: true,
            },
        },
        children: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        color: 'primary',
        rounded: 'medium',
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        color: 'primary',
        children: '산책하기',
    },
};

export const Secondary: Story = {
    args: {
        color: 'secondary',
        children: '산책하기',
    },
};

export const RoundedNone: Story = {
    name: 'Rounded None',
    args: {
        rounded: 'none',
        children: '산책하기',
    },
};

export const RoundedSmall: Story = {
    name: 'Rounded Small',
    args: {
        rounded: 'small',
        children: '산책하기',
    },
};

export const RoundedMedium: Story = {
    name: 'Rounded Medium',
    args: {
        rounded: 'medium',
        children: '산책하기',
    },
};

export const RoundedFull: Story = {
    name: 'Rounded Full',
    args: {
        rounded: 'full',
        children: '👍',
    },
};

export const Block: Story = {
    name: 'Block',
    args: {
        rounded: 'none',
        className: 'w-full',
        children: '저장하기',
    },
};

export const LinkButton: Story = {
    name: 'Link',
    render: () => (
        <Button asChild>
            <a href="https://dangdang-walk.vercel.app/" target="_blank" rel="noreferrer">
                댕댕워크로 가기
            </a>
        </Button>
    ),
};
