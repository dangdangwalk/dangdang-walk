import { cn } from '@/utils/tailwind-class';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap h-12 px-4 rounded-md text-base font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none',
    {
        variants: {
            color: {
                primary: 'bg-primary text-primary-foreground disabled:bg-[#E5E5E5] disabled:text-[#999999]',
                secondary: 'bg-secondary text-secondary-foreground disabled:opacity-50',
            },
        },
        defaultVariants: {
            color: 'primary',
        },
    }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, color, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return <Comp className={cn(buttonVariants({ color, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = 'CommonButton';

interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export { Button, buttonVariants };
