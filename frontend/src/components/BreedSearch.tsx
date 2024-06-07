import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import Topbar from '@/components/commons/Topbar';
import TopBack from '@/assets/icons/ic-arrow-left.svg';
import Search from '@/assets/icons/ic-search.svg';
import { useBreed } from '@/hooks/useBreed';
import DeleteBtn from '@/assets/buttons/btn-delete.svg';
import { DogCreateForm } from '@/models/dog';
interface Props {
    isOpen?: boolean;
    setIsOpen?: (state: boolean) => void;
    setData?: Dispatch<SetStateAction<DogCreateForm>>;
}
export default function BreedSearch({ isOpen, setIsOpen, setData }: Props) {
    const { data } = useBreed();
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState<string[]>([]);
    const handleSetBreed = (item: string) => {
        if (setData && setIsOpen) {
            setData((prev) => ({
                ...prev,
                breed: item,
            }));
            setIsOpen(false);
            setSearched([]);
            setSearch('');
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        const regex = new RegExp(`(${value})`, 'gi');

        const filteredData = data.filter((item: string) => item.includes(value));
        const formattedData = filteredData.map((item: string) => (
            <div
                key={item}
                className="font-NanumGothic flex h-[2.125rem] w-full items-center border-b border-b-zinc-300 py-3 pl-1 text-sm font-bold"
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
            className={`fixed left-full top-0 z-30 flex h-full w-full flex-col bg-white duration-200 ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
        >
            <Topbar>
                <Topbar.Front className="pl-3">
                    <img
                        src={TopBack}
                        alt="ToBack"
                        onClick={() => {
                            setIsOpen && setIsOpen(false);
                            setSearch('');
                            setSearched([]);
                        }}
                    />
                </Topbar.Front>
            </Topbar>
            <main className="mt-3 flex w-full flex-col items-center justify-center px-5">
                <div className="inline-flex h-12 w-full items-start justify-start gap-2 rounded-lg border border-neutral-200 bg-white py-3.5 pl-3">
                    <img src={Search} alt="search" />
                    <input
                        value={search}
                        onChange={handleChange}
                        placeholder="견종 검색하기"
                        className="w-full font-['NanumGothic'] text-sm font-bold leading-[18px] text-neutral-800 outline-none"
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

                <div className="mt-2 flex w-full flex-col">{searched}</div>
            </main>
        </div>
    );
}
