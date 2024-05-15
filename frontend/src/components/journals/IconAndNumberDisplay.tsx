import { cn } from '@/utils/tailwind-class';
import { VariantProps, cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const variants = cva('', {
    variants: {
        color: {
            primary: 'text-[#222222]',
            secondary: 'text-[#BBBBBB]',
        },
    },
});

export default function IconAndNumberDisplay({ color, count, children }: Props) {
    return (
        <span className="flex gap-[6px]">
            {children}
            <span className={cn(variants({ color }))}>{count}</span>
        </span>
    );
}

interface Props extends Required<VariantProps<typeof variants>> {
    count: number;
    children: ReactNode;
}
