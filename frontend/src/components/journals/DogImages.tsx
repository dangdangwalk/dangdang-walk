import { ReactNode } from 'react';

export default function DogImages({ children }: Props) {
    return (
        <div className="flex flex-row gap-1 overflow-x-auto">
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            <span className="inline-block min-w-[104px] h-[104px] bg-slate-300">강아지 이미지</span>
            {children}
        </div>
    );
}

interface Props {
    children: ReactNode;
}
