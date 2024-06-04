import type { Meta, StoryObj } from '@storybook/react';

import { Check } from './Check';

const meta = {
    component: Check,
    tags: ['autodocs'],
    argTypes: {
        color: {
            type: { name: 'enum', value: ['primary', 'secondary'] },
            table: {
                defaultValue: { summary: 'primary' },
            },
        },
        className: {
            table: {
                disable: true,
            },
        },
    },
} satisfies Meta<typeof Check>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        color: 'primary',
        className: 'w-16',
    },
};

export const Secondary: Story = {
    args: {
        color: 'secondary',
        className: 'w-16',
    },
};
