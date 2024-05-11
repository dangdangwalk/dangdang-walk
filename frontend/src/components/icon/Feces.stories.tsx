import type { Meta, StoryObj } from '@storybook/react';

import { Feces } from './Feces';

const meta = {
    component: Feces,
    tags: ['autodocs'],
    argTypes: {
        color: {
            description: '`enum`',
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
} satisfies Meta<typeof Feces>;

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
