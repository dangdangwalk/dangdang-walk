/* eslint-disable react/prop-types */
import { Check } from '@/components/icon/Check';
import { cn } from '@/utils/tailwind-class';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useRef } from 'react';

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, Props>(
    ({ checked, labelText, className, children, ...props }, ref) => {
        const idRef = useRef<string | undefined>(labelText ? newID() : undefined);

        return (
            <div className={cn('flex items-center gap-3 h-9', className)}>
                <CheckboxPrimitive.Root
                    id={idRef.current}
                    ref={ref}
                    className="w-5 h-5 shrink-0 rounded-full ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...props}
                >
                    {children ?? <Check color={checked ? 'primary' : 'secondary'} />}
                </CheckboxPrimitive.Root>
                {labelText && (
                    <label htmlFor={idRef.current} className="text-sm">
                        {labelText}
                    </label>
                )}
            </div>
        );
    }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

function newID() {
    return Math.random().toString(36).slice(2);
}

interface Props extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    labelText?: string;
}

export { Checkbox };
