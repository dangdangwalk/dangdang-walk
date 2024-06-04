import Plus from '@/assets/icons/ic-plus.svg';
import Spinner from '@/components/commons/Spinner';
import { ChangeEventHandler, useRef } from 'react';

export default function AddImageButton({ isLoading, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <span className="inline-block h-[104px] min-w-[104px] rounded-lg bg-[#F1F1F1]">
            <>
                <button
                    className="flex h-full w-full flex-col items-center gap-[10px]"
                    disabled={isLoading}
                    onClick={handleClick}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <span className="mt-[30px] flex justify-center">
                                <img src={Plus} alt="더하기" className="w-6" />
                            </span>
                            <span className="text-xs font-semibold text-[#BABABA]">사진추가</span>
                        </>
                    )}
                </button>
                <input type="file" accept="image/*" multiple className="hidden" ref={inputRef} onChange={onChange} />
            </>
        </span>
    );

    function handleClick() {
        if (inputRef.current === null) return;
        inputRef.current.click();
    }
}

export interface Props {
    isLoading: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}
