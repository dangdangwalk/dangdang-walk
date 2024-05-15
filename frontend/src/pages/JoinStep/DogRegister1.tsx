import React, { ChangeEvent, Dispatch, MutableRefObject, SetStateAction } from 'react';
import SelectPhoto from '@/assets/icons/ic-select-photo.svg';
import { Divider } from '@/components/common/Divider';
import { DogRefInfo } from '@/pages/Join';

export interface DogBasicInfo {
    profilePhotoUrl: string;
    name: string;
    breed: string;
}
interface Props {
    data: DogBasicInfo;
    setData: Dispatch<SetStateAction<DogRefInfo>>;
    setCropperToggle: (check: boolean) => void;
    onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: MutableRefObject<null>;
}

export default function DogRegister1({ data, setData, setCropperToggle, onSelectFile, fileInputRef }: Props) {
    const handleNameChange = (name: string) => {
        setData((prev) => ({
            ...prev,
            dogBasicInfo: {
                ...prev.dogBasicInfo,
                name,
            },
        }));
    };
    const handleBreedChange = (breed: string) => {
        setData((prev) => ({
            ...prev,
            dogBasicInfo: {
                ...prev.dogBasicInfo,
                breed,
            },
        }));
    };
    return (
        <div className="flex flex-col bg-white ">
            <div>
                <span className="text-amber-500 text-xl font-semibold leading-[30px]">반려견의 기본 정보</span>
                <span className="text-neutral-800 text-xl font-semibold leading-[30px]">
                    를
                    <br />
                    알려주세요 :)
                </span>
            </div>
            <div className="mt-8 mb-6 flex justify-center">
                <label htmlFor="input-upload" ref={fileInputRef}>
                    <input
                        className="hidden"
                        name="input"
                        id="input-upload"
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                    />
                    <img
                        src={data.profilePhotoUrl ? data.profilePhotoUrl : SelectPhoto}
                        alt="selectphoto"
                        className="size-[7.5rem] rounded-full"
                    />
                </label>
            </div>
            <div className="flex flex-col gap-12">
                <div className="py-3 relative">
                    <input
                        type="text"
                        placeholder="이름이 궁금해요"
                        className="outline-none w-full"
                        maxLength={10}
                        value={data.name}
                        onChange={(event) => handleNameChange(event.target.value)}
                    />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
                <div className="py-3 relative">
                    <input
                        type="text"
                        placeholder="견종이 궁금해요"
                        className="outline-none w-full"
                        value={data.breed}
                        onChange={(event) => handleBreedChange(event.target.value)}
                    />
                    <Divider className="absolute bottom-0 h-[1px]" />
                </div>
            </div>
        </div>
    );
}
