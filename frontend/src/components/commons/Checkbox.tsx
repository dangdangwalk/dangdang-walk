/* eslint-disable react/prop-types */
import { Check } from '@/components/icons/Check';
import { cn } from '@/utils/tailwindClass';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useRef } from 'react';

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, Props>(
    ({ checked, labelText, className, children, testId = 'Checkbox', ...props }, ref) => {
        const idRef = useRef<string | undefined>(labelText ? generateId() : undefined);

        return (
            <div className={cn('flex h-9 items-center gap-3', className)}>
                <CheckboxPrimitive.Root
                    id={idRef.current}
                    ref={ref}
                    className="size-5 shrink-0 rounded-full ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid={`checkbox-${testId}`}
                    {...props}
                >
                    {children ?? (
                        <Check color={checked ? 'primary' : 'disabled'} data-testid={`check-icon-${testId}`} />
                    )}
                </CheckboxPrimitive.Root>
                {labelText && (
                    <label htmlFor={idRef.current} className="text-sm" data-testid={`check-label-${testId}`}>
                        {labelText}
                    </label>
                )}
            </div>
        );
    }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

function generateId() {
    return Math.random().toString(36).slice(2);
}

interface Props extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    labelText?: string;
    testId?: string | number | undefined;
}

export { Checkbox };
