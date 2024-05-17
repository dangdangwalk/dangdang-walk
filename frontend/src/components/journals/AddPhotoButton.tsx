import Plus from '@/assets/icons/ic-plus.svg';
import Spinner from '@/components/common/Spinner';
import { ChangeEventHandler } from 'react';

export default function AddPhotoButton({ isLoading, onChange }: Props) {
    return (
        <span className="inline-block min-w-[104px] h-[104px] bg-[#F1F1F1] rounded-lg">
            {isLoading ? (
                <Spinner />
            ) : (
                <button className="block w-full h-full">
                    <label className="block w-full h-full pt-[30px]">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={onChange} />
                        <span className="flex justify-center">
                            <img src={Plus} alt="더하기" className="w-6" />
                        </span>
                        <span className="mt-2.5 text-[#BABABA] text-xs font-semibold">사진추가</span>
                    </label>
                </button>
            )}
        </span>
    );
}

interface Props {
    isLoading: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}
