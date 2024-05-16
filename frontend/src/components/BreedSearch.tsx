import React, { Dispatch, SetStateAction } from 'react';
import Topbar from '@/components/common/Topbar';
import TopBack from '@/assets/icons/ic-top-back.svg';
import Search from '@/assets/icons/ic-search.svg';
import { DogRegInfo } from '@/pages/Join';
interface Props {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    setData: Dispatch<SetStateAction<DogRegInfo>>;
}
export default function BreedSearch({ isOpen, setIsOpen, setData }: Props) {
    return (
        <div
            className={`fixed flex flex-col bg-white w-full h-full z-10 top-0 left-full duration-200 ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
        >
            <Topbar>
                <Topbar.Front className="pl-3">
                    <img src={TopBack} alt="ToBack" onClick={() => setIsOpen(false)} />
                </Topbar.Front>
            </Topbar>
            <main className="flex flex-col w-full px-5 mt-3 justify-center items-center">
                <div className="w-full h-12 pl-3  py-3.5 bg-white rounded-lg border border-neutral-200 justify-start items-start gap-2 inline-flex">
                    <img src={Search} alt="search" />
                    <input
                        placeholder="견종 검색하기"
                        maxLength={999}
                        className="w-full text-neutral-800 text-sm font-bold font-['NanumGothic'] leading-[18px] outline-none"
                    />
                </div>

                <div className="flex flex-col w-full mt-2">
                    <div className="flex items-center w-full  text-sm font-bold font-['NanumGothic'] h-[2.125rem] pl-1 py-3 border-b border-b-zinc-300">
                        <span className="h-5">말티즈</span>
                    </div>
                    <div className="flex items-center w-full text-sm font-bold font-['NanumGothic'] h-[2.125rem] pl-1 py-3 border-b border-b-zinc-300">
                        말티즈
                    </div>
                    <div className="flex items-center w-full text-sm font-bold font-['NanumGothic'] h-[2.125rem] pl-1 py-3 border-b border-b-zinc-300">
                        말티즈
                    </div>
                </div>
            </main>
        </div>
    );
}
