import { cn } from '@/utils/tailwindClass';
import React from 'react';

interface SelectBoxProps {
    children: React.ReactNode;
    className?: string;
}
export default function SelectBox({ children, className }: SelectBoxProps) {
    return <div className={cn(`${className}`)}>{children}</div>;
}

function Group({ children, className }: SelectBoxProps) {
    return (
        <ul
            className={cn(
                `absolute z-10 px-[10px] -translate-x-1/3 bg-white rounded-lg shadow flex-col justify-center items-center inline-flex ${className}`
            )}
        >
            {children}
        </ul>
    );
}
function Label({ children, className }: SelectBoxProps) {
    return <div className={cn(`${className}`)}>{children}</div>;
}

function Item({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}) {
    return (
        <li className={cn(`p-[10px] ${className}`)} onClick={onClick}>
            {children}
        </li>
    );
}

SelectBox.Group = Group;
SelectBox.Label = Label;
SelectBox.Item = Item;
