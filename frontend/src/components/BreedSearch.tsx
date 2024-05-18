import React, { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import Topbar from '@/components/common/Topbar';
import TopBack from '@/assets/icons/ic-top-back.svg';
import Search from '@/assets/icons/ic-search.svg';
import { DogRegInfo } from '@/pages/Join';
import { useBreed } from '@/hooks/useBreed';
import DeleteBtn from '@/assets/icons/btn-delete.svg';
interface Props {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    setData: Dispatch<SetStateAction<DogRegInfo>>;
}
export default function BreedSearch({ isOpen, setIsOpen, setData }: Props) {
    const { data } = useBreed();
    const [search, setSearch] = useState('');

    const [searched, setSearched] = useState<string[]>([]);
    const handleSetBreed = (item: string) => {
        setData((prev) => ({
            ...prev,
            breed: item,
        }));
        setIsOpen(false);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        const regex = new RegExp(`(${value})`, 'gi');

        const filteredData = data.filter((item: string) => item.includes(value));
        const formattedData = filteredData.map((item: string) => (
            <div
                key={item}
                className="flex items-center w-full text-sm font-bold font-NanumGothic h-[2.125rem] pl-1 py-3 border-b border-b-zinc-300"
                onClick={() => handleSetBreed(item)}
            >
                <span
                    className="h-5"
                    dangerouslySetInnerHTML={{
                        __html: item.replace(regex, '<span class="text-primary">$1</span>'),
                    }}
                />
            </div>
        ));

        value === '' ? setSearched([]) : setSearched(formattedData);
    };
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
                        value={search}
                        onChange={handleChange}
                        placeholder="견종 검색하기"
                        className="w-full text-neutral-800 text-sm font-bold font-['NanumGothic'] leading-[18px] outline-none"
                    />
                    {search && (
                        <img
                            className="mr-4"
                            src={DeleteBtn}
                            alt="deletebtn"
                            onClick={() => {
                                setSearch('');
                                setSearched([]);
                            }}
                        />
                    )}
                </div>

                <div className="flex flex-col w-full mt-2">{searched}</div>
            </main>
        </div>
    );
}
