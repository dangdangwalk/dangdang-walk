import { cn } from '@/utils/tailwindClass';
import { VariantProps, cva } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

const variants = cva('my-[10px]', {
    variants: {
        headingNumber: {
            1: 'text-lg font-bold',
            2: 'text-base font-semibold',
            3: 'text-base font-semibold',
            4: 'text-base font-semibold',
            5: 'text-base font-semibold',
            6: 'text-base font-semibold',
        },
    },
});
export default function Heading({ headingNumber, children, ...props }: Props) {
    const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;
    const Tag = headings[headingNumber];

    return (
        <Tag className={cn(variants({ headingNumber }))} {...props}>
            {children}
        </Tag>
    );
}

interface Props extends HTMLAttributes<HTMLHeadingElement>, Ensure<VariantProps<typeof variants>> {}

type NonNullableProps<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

type Ensure<T> = T & Required<NonNullableProps<T>>;
