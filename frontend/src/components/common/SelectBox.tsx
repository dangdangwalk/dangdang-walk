import { cn } from '@/utils/tailwindClass';
import IcDrop from '@/assets/icons/ic-drop-down.svg';

import React, { useContext, useEffect, useRef, useState } from 'react';
interface DefaultProps {
    className?: string;
    children?: React.ReactNode;
}

interface SelectBoxProps extends DefaultProps {
    defaultValue: string | undefined;
    onChange?: (value: string) => void;
}

interface SelectContextType {
    selectedValue: string | undefined;
    selectOption: (value: string) => void;
    toggleOpen: () => void;
    isOpen: boolean;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export default function SelectBox({ children, className, onChange, defaultValue }: SelectBoxProps) {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectOption = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        if (onChange) {
            onChange(value);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <SelectContext.Provider value={{ selectedValue, selectOption, toggleOpen, isOpen }}>
            <div ref={selectRef} className={cn(`${className}`)}>
                {children}
            </div>
            ;
        </SelectContext.Provider>
    );
}

function Group({ children, className }: DefaultProps) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error('Option must be used within a CustomSelect');
    }

    const { isOpen } = context;
    return (
        <>
            {isOpen && (
                <ul
                    className={cn(
                        `absolute z-10 px-[10px] -translate-x-1/3 bg-white rounded-lg shadow flex-col justify-start items-start inline-flex ${className}`
                    )}
                >
                    {children}
                </ul>
            )}
        </>
    );
}

function Label({ children, className }: DefaultProps) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error('Option must be used within a CustomSelect');
    }

    const { toggleOpen, selectedValue, isOpen } = context;
    return (
        <div className={cn(` ${className}`)} onClick={toggleOpen}>
            {children ? (
                children
            ) : (
                <>
                    <span>{selectedValue}</span>
                    <img src={IcDrop} className={`${isOpen ? 'rotate-180' : 'rotate-0'} transition`} alt="select box" />
                </>
            )}
        </div>
    );
}

interface OptionProps extends DefaultProps {
    value: string;
}

function Option({ value, children, className }: OptionProps) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error('Option must be used within a CustomSelect');
    }

    const { selectOption } = context;
    return (
        <li className={cn(`p-[10px] ${className}`)} onClick={() => selectOption(value)}>
            {children}
        </li>
    );
}

SelectBox.Group = Group;
SelectBox.Label = Label;
SelectBox.Option = Option;
