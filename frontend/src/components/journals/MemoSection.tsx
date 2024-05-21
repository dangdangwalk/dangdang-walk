import Heading from '@/components/journals/Heading';
import { RefObject } from 'react';

export default function MemoSection({ textAreaRef, readonly = false }: Props) {
    return (
        <div className="px-5 py-[10px]">
            <Heading headingNumber={2}>메모</Heading>
            <textarea
                name="memo"
                className="w-full h-[100px] my-2 px-4 py-3 rounded-lg border border-[#E4E4E4] text-xs placeholder:text-[#BABABA]"
                placeholder="오늘 산책에 대해서 자유롭게 메모해보세요."
                readOnly={readonly}
                ref={textAreaRef}
            />
        </div>
    );
}

interface Props {
    textAreaRef: RefObject<HTMLTextAreaElement>;
    readonly?: boolean;
}
