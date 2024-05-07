import { cn } from '@/utils/tailwind-class';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap h-12 px-4 text-base font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none',
    {
        variants: {
            color: {
                primary: 'bg-primary text-primary-foreground disabled:bg-[#E5E5E5] disabled:text-[#999999]',
                secondary: 'bg-secondary text-secondary-foreground disabled:opacity-50',
            },
            rounded: {
                none: 'rounded-none',
                small: 'rounded-lg',
                medium: 'rounded-[32px]',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            color: 'primary',
            rounded: 'medium',
        },
    }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, color, rounded, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return <Comp className={cn(buttonVariants({ color, rounded, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = 'CommonButton';

interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export { Button, buttonVariants };
