/* eslint-disable react/prop-types */
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { buttonVariants } from '@/components/common/Button';
import { cn } from '@/utils/tailwindClass';
import { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, forwardRef } from 'react';

const Modal = AlertDialogPrimitive.Root;

const ModalTrigger = AlertDialogPrimitive.Trigger;

const ModalPortal = AlertDialogPrimitive.Portal;

const ModalOverlay = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Overlay>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#222222] opacity-40',
            className
        )}
        {...props}
        ref={ref}
    />
));
ModalOverlay.displayName = 'CommonModalOverlay';

const ModalContent = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Content>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
    <ModalPortal>
        <ModalOverlay />
        <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid h-[146px] w-[292px] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[10px] border border-slate-200 bg-white px-3 pb-3 pt-5 shadow-lg duration-200',
                className
            )}
            {...props}
        />
    </ModalPortal>
));
ModalContent.displayName = 'CommonModalContent';

const ModalHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
ModalHeader.displayName = 'CommonModalHeader';

const ModalFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex justify-between', className)} {...props} />
);
ModalFooter.displayName = 'CommonModalFooter';

const ModalTitle = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={cn('pl-2 text-base font-bold text-[#222222]', className)}
        {...props}
    />
));
ModalTitle.displayName = 'CommonModalTitle';

const ModalDescription = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        ref={ref}
        className={cn('pl-2 text-xs font-semibold text-[#545454]', className)}
        {...props}
    />
));
ModalDescription.displayName = 'CommonModalDescription';

const ModalAction = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Action>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(
            buttonVariants({ color: 'primary', rounded: 'small' }),
            'h-11 w-[130px] text-sm font-semibold',
            className
        )}
        {...props}
    />
));
ModalAction.displayName = 'CommonModalAction';

const ModalCancel = forwardRef<
    ElementRef<typeof AlertDialogPrimitive.Cancel>,
    ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(
            buttonVariants({ color: 'secondary', rounded: 'small' }),
            'h-11 w-[130px] text-sm font-semibold',
            className
        )}
        {...props}
    />
));
ModalCancel.displayName = 'CommonModalCancel';

export {
    Modal,
    ModalAction,
    ModalCancel,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalPortal,
    ModalTitle,
    ModalTrigger,
};
