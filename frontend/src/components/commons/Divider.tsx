/* eslint-disable react/prop-types */
import { cn } from '@/utils/tailwindClass';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

const Divider = forwardRef<
    ElementRef<typeof SeparatorPrimitive.Root>,
    ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
            'shrink-0',
            orientation === 'horizontal' ? 'h-1 w-full bg-[#f6f6f6]' : 'h-5 w-[1px] bg-[#e4e4e4]',
            className
        )}
        {...props}
    />
));
Divider.displayName = 'CommonDivider';

export { Divider };
