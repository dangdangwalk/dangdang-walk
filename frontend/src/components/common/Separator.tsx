/* eslint-disable react/prop-types */
import { cn } from '@/utils/tailwind-class';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
            'shrink-0',
            orientation === 'horizontal' ? 'bg-[#f6f6f6] h-1 w-full' : 'bg-[#e4e4e4] h-5 w-[1px]',
            className
        )}
        {...props}
    />
));
Separator.displayName = 'CommonSeparator';

export { Separator };
