import { cn } from '@/utils/tailwind-class';
import { VariantProps, cva } from 'class-variance-authority';
import type { SVGProps } from 'react';

const SVGVariants = cva('', {
    variants: {
        color: {
            primary: 'fill-primary',
            secondary: 'fill-[#e5e5e5]',
        },
    },
    defaultVariants: {
        color: 'primary',
    },
});

function Check({ color, className, ...props }: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn(SVGVariants({ color, className }))}
            {...props}
        >
            <circle cx={12} cy={12} r={12} />
            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 11.5 4 4L18 9" />
        </svg>
    );
}

interface Props extends Omit<SVGProps<SVGSVGElement>, 'color'>, VariantProps<typeof SVGVariants> {}

export { Check, SVGVariants };
