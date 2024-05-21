import Plus from '@/assets/icons/ic-plus.svg';
import Spinner from '@/components/common/Spinner';
import { ChangeEventHandler, useRef } from 'react';

export default function AddImageButton({ isLoading, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <span className="inline-block min-w-[104px] h-[104px] bg-[#F1F1F1] rounded-lg">
            <>
                <button
                    className="flex w-full h-full flex-col items-center gap-[10px]"
                    disabled={isLoading}
                    onClick={handleClick}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <span className="flex justify-center mt-[30px]">
                                <img src={Plus} alt="더하기" className="w-6" />
                            </span>
                            <span className="text-[#BABABA] text-xs font-semibold">사진추가</span>
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
