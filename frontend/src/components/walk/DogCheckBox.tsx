import CheckOff from '@/assets/icons/property1-check-off.svg';
import CheckOn from '@/assets/icons/property1-check-on.svg';

interface CheckboxProps {
    id: number;
    isChecked: boolean;
    onChange: (id: number) => void;
}

export default function DogCheckBox({ id, isChecked, onChange }: CheckboxProps) {
    const handleCheckboxChange = () => {
        onChange(id);
    };

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="hidden" checked={isChecked} onChange={handleCheckboxChange} />
            <div className="relative w-9 h-9">
                <img
                    src={isChecked ? CheckOn : CheckOff}
                    alt={isChecked ? 'Checked' : 'Unchecked'}
                    className="w-full object-cover"
                />
            </div>
        </label>
    );
}
