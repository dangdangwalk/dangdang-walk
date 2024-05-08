import React from 'react';
interface Props {
    id: string;
    checked: boolean;
    content: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function CheckBox({ id, checked, onChange, content }: Props) {
    return (
        <div className="flex">
            <input type="checkbox" id={id} checked={checked} onChange={onChange} />
            <label htmlFor={id}>{content}</label>
        </div>
    );
}
